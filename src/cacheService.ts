import { Config } from './config.js';
import {
  convertOrigToTargetOdds,
  Mapping,
  Odds,
  OddsOrig,
  parseMappings,
  parseOddsOrig,
} from './converters.js';
import logger from './logger.js';
import { SimulationClient } from './simulationClient.js';

export class CacheService {
  private logger: logger.Logger;
  private mapping: Mapping;
  private state: OddsOrig;
  constructor(
    private simulationClient: SimulationClient,
    private updateIntervalsMs: Config['updateIntervalsMs']
  ) {
    this.logger = logger.getLogger('api');
    this.logger.info('Starting CacheService');
    void this.updateMapppings();
    void this.updateState();
    setInterval(() => void this.updateMapppings(), updateIntervalsMs.mappings);
    setInterval(() => void this.updateState(), updateIntervalsMs.state);
  }

  getState(): Odds {
    const data = convertOrigToTargetOdds(this.state, this.mapping);
    return data;
  }

  async updateMapppings() {
    this.logger.info('Updating mappings');
    const data = await this.simulationClient.getRawMapppings();
    if (
      data &&
      typeof data === 'object' &&
      'mappings' in data &&
      typeof data.mappings === 'string'
    ) {
      try {
        this.mapping = parseMappings(data.mappings);
      } catch {
        this.logger.error('Error parsing mappings');
      }
    } else {
      this.logger.error('No mappings retrieved');
    }
  }

  async updateState() {
    this.logger.info('Updating state');
    const data = await this.simulationClient.getRawState();
    if (data && typeof data === 'object' && 'odds' in data && typeof data.odds === 'string') {
      try {
        this.state = parseOddsOrig(data.odds);
      } catch {
        this.logger.error('Error parsing state');
      }
    } else {
      this.logger.error('No state retrieved');
    }
  }
}
