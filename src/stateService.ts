import { SimulationClient } from './simulationClient.js';

export class StateService {
  constructor(private simulationClient: SimulationClient) {}
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
