import { MIGRATION_VERSION } from '../config/constants.js';
import { MigrationVersion } from '../models/index.js';
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

    await MigrationVersion.create({ version: MIGRATION_VERSION });
  }
};
