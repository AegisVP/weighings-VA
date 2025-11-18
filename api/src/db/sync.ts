import { MIGRATION_VERSION } from '../config/constants.js';
import { Feature, MigrationVersion } from '../models/index.js';
import { sequelize } from './db.js';

export const runMigrationIfNeeded = async () => {
  let doMigrate = false;
  let dbVersion = 0;
  const syncCondition = { alter: true, force: false };

  try {
    const latestEntry = await MigrationVersion.findOne({
      attributes: ['version'],
      order: [['appliedAt', 'DESC']],
      limit: 1,
    });

    dbVersion = latestEntry?.version || 0;
    doMigrate = dbVersion < MIGRATION_VERSION;

    console.log(`Database model is at version ${dbVersion}`);
    console.log(`Latest migration version is at ${MIGRATION_VERSION}`);
  } catch (_e) {
    console.log('Error occurred when checking migration version');
    await MigrationVersion.sync(syncCondition);
    doMigrate = true;
  }

  if (doMigrate) {
    console.log(`Migrating database model from version ${dbVersion} to ${MIGRATION_VERSION}`);
    await sequelize.sync(syncCondition);
    try {
      await Feature.create({ name: 'ADMIN', description: '', enabled: true });
    } catch (error) {
      console.log('ADMIN feature already exists');
    }
    try {
      await Feature.create({ name: 'WEIGHING_ADD', description: '', enabled: true });
    } catch (error) {
      console.log('WEIGHING_ADD feature already exists');
    }
    try {
      await Feature.create({ name: 'DATA_ANALYZE', description: '', enabled: true });
    } catch (error) {
      console.log('DATA_ANALYZE feature already exists');
    }
    try {
      await Feature.create({ name: 'SETTINGS_CHANGE', description: '', enabled: true });
    } catch (error) {
      console.log('SETTINGS_CHANGE feature already exists');
    }

    await MigrationVersion.upsert({ version: MIGRATION_VERSION });
  }
};
