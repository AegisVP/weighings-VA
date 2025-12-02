import { Sequelize, Op } from 'sequelize';
import {
  REMOTE_DB_HOST,
  REMOTE_DB_PORT,
  REMOTE_DB_NAME,
  REMOTE_DB_USER,
  REMOTE_DB_PASS,
  SYNC_ENABLED,
} from '../config/constants.js';
import { Crop, Feature, Location, Machine, Operator, User, UserHasFeature, Weighing } from '../models/index.js';

const INITIAL_RETRY_INTERVAL = 60 * 1000; // 1 minute
const MAX_RETRY_INTERVAL = 15 * 60 * 1000; // 15 minutes

class SyncRunner {
  private remoteDb: Sequelize | null = null;
  private currentRetryInterval = INITIAL_RETRY_INTERVAL;
  private consecutiveFailures = 0;
  private syncTimer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private isSyncing = false;
  private lastSyncTime: Date | null = null;
  private lastSyncStatus: 'success' | 'failed' | 'pending' = 'pending';
  private lastSyncError: string | null = null;
  private static instance: SyncRunner;

  public static getInstance(): SyncRunner {
    if (!SyncRunner.instance) {
      SyncRunner.instance = new SyncRunner();
    }
    return SyncRunner.instance;
  }

  constructor() {
    if (!SYNC_ENABLED) {
      console.log('[Sync] Synchronization is disabled');
      return;
    }

    if (!REMOTE_DB_HOST) {
      console.warn('[Sync] Remote database host not configured. Sync disabled.');
      return;
    }

    this.initializeRemoteConnection();
  }

  private initializeRemoteConnection() {
    try {
      this.remoteDb = new Sequelize({
        host: REMOTE_DB_HOST,
        port: REMOTE_DB_PORT,
        database: REMOTE_DB_NAME,
        username: REMOTE_DB_USER,
        password: REMOTE_DB_PASS,
        dialect: 'postgres',
        dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
        logging: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      });

      console.log('[Sync] Remote database connection configured');
    } catch (error) {
      console.error('[Sync] Failed to initialize remote database:', error);
    }
  }

  async start() {
    if (!SYNC_ENABLED || !this.remoteDb) {
      return;
    }

    console.log('[Sync] Starting sync runner...');
    this.isRunning = true;
    this.scheduleNextSync();
  }

  async stop() {
    console.log('[Sync] Stopping sync runner...');
    this.isRunning = false;

    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }

    if (this.remoteDb) {
      await this.remoteDb.close();
    }
  }

  private scheduleNextSync() {
    if (!this.isRunning) return;

    const interval = Math.min(this.currentRetryInterval, MAX_RETRY_INTERVAL);

    this.syncTimer = setTimeout(async () => {
      await this.performSync();
      this.scheduleNextSync();
    }, interval);
  }

  private async performSync() {
    if (this.isSyncing) {
      console.log('[Sync] Sync already in progress, skipping scheduled sync');
      return;
    }

    try {
      this.registerStartOfSync();

      // Check if there's data to sync
      const hasDataToSync = await this.checkForUnsyncedData();

      if (!hasDataToSync) {
        this.registerSuccess();
        return;
      }

      console.log('[Sync] Found data to synchronize');

      // Test connection
      await this.remoteDb!.authenticate();
      console.log('[Sync] Connected to remote database');

      // Perform synchronization
      await this.syncData();

      this.registerSuccess();
      console.log('[Sync] Synchronization completed successfully');
    } catch (error) {
      this.registerError(error);

      console.warn(
        `[Sync] Synchronization failed (attempt ${this.consecutiveFailures}). ` +
          `Next retry in ${this.currentRetryInterval / 1000}s`,
        this.lastSyncError
      );
    } finally {
      this.isSyncing = false;
    }
  }

  public async triggerManualSync(): Promise<{
    triggered: boolean;
    message: string;
    recordsSynced?: number;
  }> {
    if (!SYNC_ENABLED || !this.remoteDb) {
      return {
        triggered: false,
        message: 'Sync is not enabled or remote database not configured',
      };
    }

    if (this.isSyncing) {
      return {
        triggered: false,
        message: 'Sync is already in progress',
      };
    }

    console.log('[Sync] Manual sync triggered');

    try {
      this.registerStartOfSync();

      // Check if there's data to sync
      const hasDataToSync = await this.checkForUnsyncedData();

      if (!hasDataToSync) {
        this.registerSuccess();
        return {
          triggered: true,
          message: 'No data to synchronize',
          recordsSynced: 0,
        };
      }

      // Test connection
      await this.remoteDb.authenticate();
      console.log('[Sync] Connected to remote database');

      // Perform synchronization
      const recordsSynced = await this.syncData();

      this.registerSuccess();

      console.log('[Sync] Manual synchronization completed successfully');

      return {
        triggered: true,
        message: 'Synchronization completed successfully',
        recordsSynced,
      };
    } catch (error) {
      this.registerError(error);

      console.error('[Sync] Manual synchronization failed:', this.lastSyncError);

      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  public getStatus() {
    return {
      enabled: SYNC_ENABLED,
      isRunning: this.isRunning,
      isSyncing: this.isSyncing,
      lastSyncTime: this.lastSyncTime,
      lastSyncStatus: this.lastSyncStatus,
      lastSyncError: this.lastSyncError,
      consecutiveFailures: this.consecutiveFailures,
      nextCheckIn: this.syncTimer ? Math.round(this.currentRetryInterval / 1000) : null,
      remoteDbConfigured: !!this.remoteDb,
    };
  }

  private registerStartOfSync() {
    this.isSyncing = true;
    this.lastSyncStatus = 'pending';
    this.lastSyncError = null;
  }

  private registerSuccess() {
    this.consecutiveFailures = 0;
    this.currentRetryInterval = INITIAL_RETRY_INTERVAL;
    this.lastSyncStatus = 'success';
    this.lastSyncTime = new Date();
    this.lastSyncError = null;
  }

  private registerError(error: unknown) {
    this.consecutiveFailures++;
    this.currentRetryInterval = Math.min(
      INITIAL_RETRY_INTERVAL * Math.pow(1.2, this.consecutiveFailures - 1),
      MAX_RETRY_INTERVAL
    );
    this.lastSyncStatus = 'failed';
    this.lastSyncTime = new Date();
    this.lastSyncError = error instanceof Error ? error.message : 'Unknown error';
  }

  private async checkForUnsyncedData(): Promise<boolean> {
    const models = [Feature, User, UserHasFeature, Crop, Location, Machine, Operator, Weighing];

    for (const model of models) {
      const count = await (model as any).count({
        where: {
          [Op.or]: [
            { syncedAt: null },
            {
              syncedAt: {
                [Op.lt]: Sequelize.col(`${model.name}.updated_at`),
              },
            },
          ],
        },
      });

      if (count > 0) {
        return true;
      }
    }

    return false;
  }

  private async syncData(): Promise<number> {
    const models = [
      { model: Feature, name: 'features' },
      { model: User, name: 'users' },
      { model: UserHasFeature, name: 'user_has_feature' },
      { model: Crop, name: 'crops' },
      { model: Location, name: 'locations' },
      { model: Machine, name: 'machines' },
      { model: Operator, name: 'operators' },
      { model: Weighing, name: 'weighings' },
    ];

    let totalRecordsSynced = 0;

    for (const { model, name } of models) {
      const count = await this.syncModel(model, name);
      totalRecordsSynced += count;
    }

    return totalRecordsSynced;
  }

  private async syncModel(model: any, tableName: string): Promise<number> {
    try {
      // Find records that need syncing
      const records = await model.findAll({
        where: {
          [Op.or]: [
            { syncedAt: null },
            {
              syncedAt: {
                [Op.lt]: Sequelize.col(`${model.name}.updated_at`),
              },
            },
          ],
        },
        paranoid: false, // Include soft-deleted records
      });

      if (records.length === 0) {
        return 0;
      }

      console.log(`[Sync] Syncing ${records.length} records from ${tableName}`);

      // Sync each record
      for (const record of records) {
        await this.syncRecord(record, tableName);
      }

      console.log(`[Sync] Successfully synced ${tableName}`);
      return records.length;
    } catch (error) {
      console.error(`[Sync] Error syncing ${tableName}:`, error);
      throw error;
    }
  }

  private async syncRecord(record: any, tableName: string) {
    const data = record.get({ plain: true });
    const now = new Date();

    // Helper function to convert camelCase to snake_case
    const toSnakeCase = (str: string): string => {
      return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    };

    // Filter out associated models/arrays (like 'features')
    const snakeCaseData: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip arrays and objects that are associations
      if (Array.isArray(value) || (typeof value === 'object' && value !== null && !(value instanceof Date))) {
        continue;
      }
      snakeCaseData[toSnakeCase(key)] = value;
    }

    try {
      const columns = Object.keys(snakeCaseData);
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const updateSet = columns
        .filter((col) => col !== 'id')
        .map((col) => `${col} = EXCLUDED.${col}`)
        .join(', ');

      // Use raw query to upsert data to remote database
      await this.remoteDb!.query(
        `
        INSERT INTO ${tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        ON CONFLICT (id) DO UPDATE SET
          ${updateSet}
        `,
        {
          bind: Object.values(snakeCaseData),
        }
      );

      // Update local record's syncedAt timestamp
      await record.update({ syncedAt: now }, { silent: true });
    } catch (error) {
      console.error(`[Sync] Failed to sync record ${record.id} in ${tableName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const syncRunner = SyncRunner.getInstance();
