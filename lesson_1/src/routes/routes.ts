import type { Express } from 'express';

import { videosRoutes } from './videos.routes';

export default (app: Express) => {
  videosRoutes(app);
};