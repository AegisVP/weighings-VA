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
        dialectOptions: { ssl: false },
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
    try {
      // Check if there's data to sync
      const hasDataToSync = await this.checkForUnsyncedData();

      if (!hasDataToSync) {
        // No data to sync, check again in 1 minute
        this.currentRetryInterval = INITIAL_RETRY_INTERVAL;
        return;
      }

      console.log('[Sync] Found data to synchronize');

      // Test connection
      await this.remoteDb!.authenticate();
      console.log('[Sync] Connected to remote database');

      // Perform synchronization
      await this.syncData();

      // Reset failure counter on success
      this.consecutiveFailures = 0;
      this.currentRetryInterval = INITIAL_RETRY_INTERVAL;
      console.log('[Sync] Synchronization completed successfully');
    } catch (error) {
      this.consecutiveFailures++;
      this.currentRetryInterval = Math.min(
        INITIAL_RETRY_INTERVAL * Math.pow(2, this.consecutiveFailures - 1),
        MAX_RETRY_INTERVAL
      );

      console.warn(
        `[Sync] Synchronization failed (attempt ${this.consecutiveFailures}). ` +
          `Next retry in ${this.currentRetryInterval / 1000}s`,
        error instanceof Error ? error.message : error
      );
    }
  }

  private async checkForUnsyncedData(): Promise<boolean> {
    const models = [Crop, Feature, Location, Machine, Operator, User, UserHasFeature, Weighing];

    for (const model of models) {
      const count = await (model as any).count({
        where: {
          [Op.or]: [
            { syncedAt: null },
            {
              syncedAt: {
                [Op.lt]: Sequelize.col('updated_at'),
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

  private async syncData() {
    const models = [
      { model: Crop, name: 'crops' },
      { model: Feature, name: 'features' },
      { model: Location, name: 'locations' },
      { model: Machine, name: 'machines' },
      { model: Operator, name: 'operators' },
      { model: User, name: 'users' },
      { model: UserHasFeature, name: 'user_has_feature' },
      { model: Weighing, name: 'weighings' },
    ];

    for (const { model, name } of models) {
      await this.syncModel(model, name);
    }
  }

  private async syncModel(model: any, tableName: string) {
    try {
      // Find records that need syncing
      const records = await model.findAll({
        where: {
          [Op.or]: [
            { syncedAt: null },
            {
              syncedAt: {
                [Op.lt]: Sequelize.col('updated_at'),
              },
            },
          ],
        },
        paranoid: false, // Include soft-deleted records
      });

      if (records.length === 0) {
        return;
      }

      console.log(`[Sync] Syncing ${records.length} records from ${tableName}`);

      // Sync each record
      for (const record of records) {
        await this.syncRecord(record, tableName);
      }

      console.log(`[Sync] Successfully synced ${tableName}`);
    } catch (error) {
      console.error(`[Sync] Error syncing ${tableName}:`, error);
      throw error;
    }
  }

  private async syncRecord(record: any, tableName: string) {
    const data = record.toJSON();
    const now = new Date();

    try {
      // Use raw query to upsert data to remote database
      await this.remoteDb!.query(
        `
        INSERT INTO ${tableName} (${Object.keys(data).join(', ')})
        VALUES (${Object.keys(data)
          .map((_, i) => `$${i + 1}`)
          .join(', ')})
        ON CONFLICT (id) DO UPDATE SET
          ${Object.keys(data)
            .filter((key) => key !== 'id')
            .map((key) => `${key} = EXCLUDED.${key}`)
            .join(', ')}
        `,
        {
          bind: Object.values(data),
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
