const DEFAULT_API_PORT = 3001;
const DEFAULT_ROOT_PATH = '/client';
const DEFAULT_STATE_UPDATE_INTERVAL_MS = 1000;
const DEFAULT_MAPPINGS_UPDATE_INTERVAL_MS = 10000;
const DEFAULT_STATE_URL = 'http://localhost:3000/api/state';
const DEFAULT_MAPPINGS_URL = 'http://localhost:3000/api/mappings';

export interface Config {
  api: {
    port: number;
    root: string;
  };
  requestUrls: {
    mappings: string;
    state: string;
  };
  updateIntervalsMs: {
    mappings: number;
    state: number;
  };
}

export const config: Config = {
  api: {
    port: Number(process.env.RTC_ADAPTER_API_PORT) || DEFAULT_API_PORT,
    root: process.env.RTC_ADAPTER_ROOT_PATH ?? DEFAULT_ROOT_PATH,
  },
  requestUrls: {
    mappings: process.env.RTC_ADAPTER_MAPPINGS_URL ?? DEFAULT_MAPPINGS_URL,
    state: process.env.RTC_ADAPTER_STATE_URL ?? DEFAULT_STATE_URL,
  },
  updateIntervalsMs: {
    mappings:
      Number(process.env.RTC_ADAPTER_MAPPINGS_UPDATE_INTERVAL_MS) ||
      DEFAULT_MAPPINGS_UPDATE_INTERVAL_MS,
    state:
      Number(process.env.RTC_ADAPTER_STATE_UPDATE_INTERVAL_MS) || DEFAULT_STATE_UPDATE_INTERVAL_MS,
  },
};
