import 'dotenv/config';
import { API_PORT } from './config/constants.ts';
import { verifySequelize } from './db/db.ts';
import './db/sync.ts';
import { app } from './app.ts';

(async () => {
  const startupChecks = [verifySequelize];

  await Promise.all(startupChecks)
    .then(res => {
      res.forEach(msg => console.info(msg));
    })
    .catch(err => {
      console.error('Fatal error during startup:', err);
      process.exit(1);
    });

  try {
    app.listen(API_PORT, () => {
      console.log(`Server is listening on port ${API_PORT}`);
    });
  } catch (error) {
    const { message } = error instanceof Error ? error : new Error('Unknown error');
    console.error('Error:', message);
    process.exit(1);
  }
})();
