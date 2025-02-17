import express from 'express';

import { config } from './config.js';
import logger from './logger.js';

const app = express();
const log = logger.getLogger('app');

app.listen(config.api.port);
log.info(`Started express server and listening on ${String(config.api.port)}`);

app.get(`${config.api.root}/state`, (req, res) => {
  res.json({});
});
