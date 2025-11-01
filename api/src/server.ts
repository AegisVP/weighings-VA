import { API_PORT } from './config/constants.js';
import { verifySequelize } from './db/db.js';
import { runMigrationIfNeeded } from './db/sync.js';

(async () => {
  const startupChecks = [verifySequelize];

  try {
    for (const msg in await Promise.all(startupChecks)) console.info(msg);
  } catch (err) {
    console.error('Fatal error during startup:', err);
    process.exit(1);
  }

  try {
    await runMigrationIfNeeded();
    (await import('./app.js')).app.listen(API_PORT, () => console.log(`Server is listening on port ${API_PORT}`));
  } catch (error) {
    const { message } = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error:', message);
    process.exit(1);
  }
})();
