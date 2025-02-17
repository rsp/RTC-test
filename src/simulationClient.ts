import { Config } from './config.js';

export class SimulationClient {
  constructor(
    private fetchFunction: typeof fetch,
    private urls: Config['requestUrls']
  ) {}

  async getRawMapppings() {
    const res = await this.fetchFunction(this.urls.mappings);
    const data = (await res.json()) as unknown;
    return data;
  }

  async getRawState() {
    const res = await this.fetchFunction(this.urls.state);
    const data = (await res.json()) as unknown;
    return data;
  }
}
