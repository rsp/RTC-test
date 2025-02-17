import express from 'express';

import { CacheService } from './cacheService.js';
import { config } from './config.js';
import logger from './logger.js';
import { SimulationClient } from './simulationClient.js';
import { StateService } from './stateService.js';
import { handler } from './utils.js';

const app = express();
const log = logger.getLogger('api');

app.listen(config.api.port);
log.info(`Started express server and listening on ${String(config.api.port)}`);

const simulationClient = new SimulationClient(fetch, config.requestUrls);
const cacheService = new CacheService(simulationClient, config.updateIntervalsMs);
const stateService = new StateService(simulationClient, cacheService);

app.get(`${config.api.root}/state`, (req, res) => {
  res.json({});
});

app.get(
  `${config.api.root}/internal/raw-data`,
  handler(async () => {
    const response = await stateService.getRawData();
    return response;
  })
);

app.get(
  `${config.api.root}/internal/odds-orig`,
  handler(async () => {
    const response = await stateService.getOddsOrig();
    return response;
  })
);

app.get(
  `${config.api.root}/internal/odds-target`,
  handler(async () => {
    const response = await stateService.getOddsTarget();
    return response;
  })
);

app.get(`${config.api.root}/internal/odds-target-cached`, (req, res) => {
  const response = stateService.getCachedState();
  res.json(response);
});
