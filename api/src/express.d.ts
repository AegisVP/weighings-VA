import 'express';
import type { User } from './models/index.js';

declare module 'express-serve-static-core' {
  interface Request {
    user: User;
  }
}
