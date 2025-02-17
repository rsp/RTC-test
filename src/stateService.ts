import { convertOrigToTargetOdds, parseMappings, parseOddsOrig } from './converters.js';
import { SimulationClient } from './simulationClient.js';

export class StateService {
  constructor(private simulationClient: SimulationClient) {}

  async getOddsOrig() {
    const odds = await this.simulationClient.getRawOdds();
    if (typeof odds === 'object' && odds && 'odds' in odds && typeof odds.odds === 'string') {
      return parseOddsOrig(odds.odds);
    }
  }

  async getOddsTarget() {
    const [odds, mappings] = await Promise.all([
      this.simulationClient.getRawOdds(),
      this.simulationClient.getRawMapppings(),
    ]);
    if (
      typeof odds === 'object' &&
      odds &&
      'odds' in odds &&
      typeof odds.odds === 'string' &&
      typeof mappings === 'object' &&
      mappings &&
      'mappings' in mappings &&
      typeof mappings.mappings === 'string'
    ) {
      return convertOrigToTargetOdds(parseOddsOrig(odds.odds), parseMappings(mappings.mappings));
    }
  }

  async getRawData() {
    const [odds, mappings] = await Promise.all([
      this.simulationClient.getRawOdds(),
      this.simulationClient.getRawMapppings(),
    ]);
    return {
      ...(typeof odds === 'object' ? odds : {}),
      ...(typeof mappings === 'object' ? mappings : {}),
    };
  }
}
