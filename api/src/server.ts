import { pathsExist } from './app.js';
import { API_PORT, CROSS_ENV, ENVIRONMENT_ONSITE } from './config/constants.js';
import { verifySequelize } from './db/db.js';
import { runMigrationIfNeeded } from './db/sync.js';
import { syncRunner } from './sync/syncRunner.js';

(async () => {
  const startupChecks = [verifySequelize, pathsExist];

  try {
    for (const msg of await Promise.all(startupChecks)) console.info(` -- ${msg}`);
  } catch (err) {
    console.error('Fatal error during startup:', err);
    process.exit(1);
  }

  try {
    await runMigrationIfNeeded();
    (await import('./app.js')).app.listen(API_PORT, () => console.log(`Server is listening on port ${API_PORT}`));

    // Start sync runner
    if (CROSS_ENV === ENVIRONMENT_ONSITE) await syncRunner.start();
  } catch (error) {
    const { message } = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error:', message);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await syncRunner.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await syncRunner.stop();
  process.exit(0);
});
