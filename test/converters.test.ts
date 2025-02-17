import { describe, expect, it } from 'vitest';

import {
  ClientState,
  convertOrigToTargetOdds,
  convertTargetOddsToClientState,
  Mapping,
  Odds,
  OddsOrig,
  OddsScoresOrig,
  parseMappings,
  parseOddsOrig,
  parseScoresOrig,
  parseScoresRecordOrig,
} from '../src/converters.js';

const mappingExample = {
  id: '4df1b17c-3bfe-4bbb-8b60-12661c2bb190',
  raw: '29190088-763e-4d1c-861a-d16dbfcf858c:Real Madrid;33ff69aa-c714-470c-b90d-d3883c95adce:Barcelona;b582b685-e75c-4139-8274-d19f078eabef:Manchester United;4df1b17c-3bfe-4bbb-8b60-12661c2bb190:Liverpool;3cd8eeee-a57c-48a3-845f-93b561a95782:Bayern Munich;a950b22c-989b-402f-a1ac-70df8f102e27:Paris Saint-Germain;5dbdb683-c15f-4d79-a348-03cf2861b954:Juventus;7229b223-03d6-4285-afbf-243671088a20:Chelsea;d6fdf482-8151-4651-92c2-16e9e8ea4b8b:Manchester City;f0c6f8b4-8fbc-4022-95b3-c68bca32adb9:AC Milan;6acec751-8fc4-4c44-8798-1182699869d0:Los Angeles Lakers;9012f4c9-1d9c-4137-a60d-94b853972c7e:Golden State Warriors;44bc5cb3-19c0-4f35-8ac6-100cfecf70f1:Miami Heat;e476746c-869d-4aa5-a292-587730514aae:Chicago Bulls;259ba76d-189f-420f-be50-0aac633c2153:Boston Celtics;98841461-0442-4dbb-ae53-2e039bbecad2:Houston Rockets;3138f71d-16f2-46b6-9812-d62e3fa6f981:Toronto Raptors;b98bab75-53d3-494e-a3a9-b9d1dd1fb458:Dallas Mavericks;d3fa6d41-af8c-45d1-848c-891ca86731f1:Brooklyn Nets;d34032e0-0e81-4166-8ced-dd8fd6222fcb:Denver Nuggets;c3215a44-efdb-49fb-9f01-85b26c57bbd4:UEFA Champions League;7ee17545-acd2-4332-869b-1bef06cfaec8:UEFA Europa League;28cb12c0-2542-4790-b66b-e51b9cb30c76:NBA;194e22c6-53f3-4f36-af06-53f168ebeee8:NBA - pre-season;c0a1f678-dbe5-4cc8-aa52-8c822dc65267:FOOTBALL;c72cbbc8-bac9-4cb7-a305-9a8e7c011817:BASKETBALL;ac68a563-e511-4776-b2ee-cd395c7dc424:PRE;7fa4e60c-71ad-4e76-836f-5c2bc6602156:LIVE;cb807d14-5a98-4b41-8ddc-74a1f5f80f9b:REMOVED;e2d12fef-ae82-4a35-b389-51edb8dc664e:CURRENT;6c036000-6dd9-485d-97a1-e338e6a32a51:PERIOD_1;2db8bc38-b46d-4bd9-9218-6f8dbe083517:PERIOD_2;0cfb491c-7d09-4ffc-99fb-a6ee0cf5d198:PERIOD_3;5a79d3e7-85b3-4d6b-b4bf-ddd743e7162f:PERIOD_4',
  value: 'Liverpool',
};

const scoresIdsExamle = {
  raw: 'e2d12fef-ae82-4a35-b389-51edb8dc664e@1:1|6c036000-6dd9-485d-97a1-e338e6a32a51@1:1|2db8bc38-b46d-4bd9-9218-6f8dbe083517@0:0',
  result: [
    {
      awayScore: 1,
      homeScore: 1,
      periodId: 'e2d12fef-ae82-4a35-b389-51edb8dc664e',
    },
    {
      awayScore: 1,
      homeScore: 1,
      periodId: '6c036000-6dd9-485d-97a1-e338e6a32a51',
    },
    {
      awayScore: 0,
      homeScore: 0,
      periodId: '2db8bc38-b46d-4bd9-9218-6f8dbe083517',
    },
  ],
} satisfies {
  raw: string;
  result: OddsScoresOrig[];
};

const scoresRecordsIdsExample = {
  raw: '6c036000-6dd9-485d-97a1-e338e6a32a51@1:3',
  result: {
    awayScore: 3,
    homeScore: 1,
    periodId: '6c036000-6dd9-485d-97a1-e338e6a32a51',
  },
} satisfies {
  raw: string;
  result: OddsScoresOrig;
};

const oddsIdsExampleIncomplete =
  '995e0722-4118-4f8e-a517-82f6ea240673,,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900432183,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,\n4bb7b78f-6a23-43d0-a61a-1341f03f64e0,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,194e22c6-53f3-4f36-af06-53f168ebeee8,1709900380135,d6fdf482-8151-4651-92c2-16e9e8ea4b8b,b582b685-e75c-4139-8274-d19f078eabef,7fa4e60c-71ad-4e76-836f-5c2bc6602156,e2d12fef-ae82-4a35-b389-51edb8dc664e@1:2|6c036000-6dd9-485d-97a1-e338e6a32a51@1:2';

const oddsIdsExamle = {
  raw: '995e0722-4118-4f8e-a517-82f6ea240673,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,7ee17545-acd2-4332-869b-1bef06cfaec8,1709900432183,29190088-763e-4d1c-861a-d16dbfcf858c,3cd8eeee-a57c-48a3-845f-93b561a95782,ac68a563-e511-4776-b2ee-cd395c7dc424,\n4bb7b78f-6a23-43d0-a61a-1341f03f64e0,c0a1f678-dbe5-4cc8-aa52-8c822dc65267,194e22c6-53f3-4f36-af06-53f168ebeee8,1709900380135,d6fdf482-8151-4651-92c2-16e9e8ea4b8b,b582b685-e75c-4139-8274-d19f078eabef,7fa4e60c-71ad-4e76-836f-5c2bc6602156,e2d12fef-ae82-4a35-b389-51edb8dc664e@1:2|6c036000-6dd9-485d-97a1-e338e6a32a51@1:2',
  result: [
    {
      awayCompetitorId: '3cd8eeee-a57c-48a3-845f-93b561a95782',
      competitionId: '7ee17545-acd2-4332-869b-1bef06cfaec8',
      homeCompetitorId: '29190088-763e-4d1c-861a-d16dbfcf858c',
      scores: [],
      sportEventId: '995e0722-4118-4f8e-a517-82f6ea240673',
      sportEventStatusId: 'ac68a563-e511-4776-b2ee-cd395c7dc424',
      sportId: 'c0a1f678-dbe5-4cc8-aa52-8c822dc65267',
      startTime: 1709900432183,
    },
    {
      awayCompetitorId: 'b582b685-e75c-4139-8274-d19f078eabef',
      competitionId: '194e22c6-53f3-4f36-af06-53f168ebeee8',
      homeCompetitorId: 'd6fdf482-8151-4651-92c2-16e9e8ea4b8b',
      scores: [
        { awayScore: 2, homeScore: 1, periodId: 'e2d12fef-ae82-4a35-b389-51edb8dc664e' },
        { awayScore: 2, homeScore: 1, periodId: '6c036000-6dd9-485d-97a1-e338e6a32a51' },
      ],
      sportEventId: '4bb7b78f-6a23-43d0-a61a-1341f03f64e0',
      sportEventStatusId: '7fa4e60c-71ad-4e76-836f-5c2bc6602156',
      sportId: 'c0a1f678-dbe5-4cc8-aa52-8c822dc65267',
      startTime: 1709900380135,
    },
  ],
} satisfies {
  raw: string;
  result: OddsOrig;
};

const origToTargetOddsSimplified = {
  mapping: new Map([
    ['aaa', 'AAA'],
    ['bbb', 'BBB'],
    ['ccc', 'CCC'],
  ]),
  orig: [
    {
      awayCompetitorId: 'ac',
      competitionId: 'ci',
      homeCompetitorId: 'hc',
      scores: [
        {
          awayScore: 1,
          homeScore: 2,
          periodId: 'pi1',
        },
        {
          awayScore: 3,
          homeScore: 4,
          periodId: 'pi2',
        },
        {
          awayScore: 5,
          homeScore: 6,
          periodId: 'aaa',
        },
      ],
      sportEventId: 'sei',
      sportEventStatusId: 'sesi',
      sportId: 'si',
      startTime: 1739798660151,
    },
    {
      awayCompetitorId: 'bbb',
      competitionId: 'ci',
      homeCompetitorId: 'hc',
      scores: [
        {
          awayScore: 10,
          homeScore: 20,
          periodId: 'pi1',
        },
        {
          awayScore: 15,
          homeScore: 25,
          periodId: 'pi2',
        },
      ],
      sportEventId: 'sei',
      sportEventStatusId: 'sesi',
      sportId: 'ccc',
      startTime: 1739798660151,
    },
  ],
  target: [
    {
      awayCompetitor: 'ac',
      competition: 'ci',
      homeCompetitor: 'hc',
      scores: [
        {
          awayScore: 1,
          homeScore: 2,
          period: 'pi1',
        },
        {
          awayScore: 3,
          homeScore: 4,
          period: 'pi2',
        },
        {
          awayScore: 5,
          homeScore: 6,
          period: 'AAA',
        },
      ],
      sport: 'si',
      sportEvent: 'sei',
      sportEventStatus: 'sesi',
      startTime: '2025-02-17T13:24:20.151Z',
    },
    {
      awayCompetitor: 'BBB',
      competition: 'ci',
      homeCompetitor: 'hc',
      scores: [
        {
          awayScore: 10,
          homeScore: 20,
          period: 'pi1',
        },
        {
          awayScore: 15,
          homeScore: 25,
          period: 'pi2',
        },
      ],
      sport: 'CCC',
      sportEvent: 'sei',
      sportEventStatus: 'sesi',
      startTime: '2025-02-17T13:24:20.151Z',
    },
  ],
} satisfies {
  mapping: Mapping;
  orig: OddsOrig;
  target: Odds;
};

const targetOddsToClientStateExample = {
  odds: [
    {
      awayCompetitor: 'Paris Saint-Germain',
      competition: 'UEFA Champions League',
      homeCompetitor: 'Juventus',
      scores: [{ awayScore: 0, homeScore: 0, period: 'CURRENT' }],
      sport: 'FOOTBALL',
      sportEvent: '3eccf850-571f-4e18-8cb3-2c9e3afade7b',
      sportEventStatus: 'LIVE',
      startTime: '2024-03-04T10:36:07.812Z',
    },
  ],
  state: {
    '3eccf850-571f-4e18-8cb3-2c9e3afade7b': {
      competition: 'UEFA Champions League',
      competitors: {
        AWAY: {
          name: 'Paris Saint-Germain',
          type: 'AWAY',
        },
        HOME: {
          name: 'Juventus',
          type: 'HOME',
        },
      },
      id: '3eccf850-571f-4e18-8cb3-2c9e3afade7b',
      scores: {
        CURRENT: {
          away: '0',
          home: '0',
          type: 'CURRENT',
        },
      },
      sport: 'FOOTBALL',
      startTime: '2024-03-04T10:36:07.812Z',
      status: 'LIVE',
    },
  },
} satisfies {
  odds: Odds;
  state: ClientState;
};

const targetOddsToClientStateMultiple = {
  odds: [
    {
      awayCompetitor: 'AwayX',
      competition: 'CompX',
      homeCompetitor: 'HomeX',
      scores: [
        { awayScore: 2, homeScore: 4, period: 'CURRENT' },
        { awayScore: 1, homeScore: 2, period: 'PERIOD_1' },
        { awayScore: 2, homeScore: 4, period: 'PERIOD_2' },
      ],
      sport: 'FOOTBALL',
      sportEvent: 'X',
      sportEventStatus: 'LIVE',
      startTime: '2024-03-04T10:36:07.812Z',
    },
    {
      awayCompetitor: 'AwayY',
      competition: 'CompY',
      homeCompetitor: 'HomeY',
      scores: [
        { awayScore: 1, homeScore: 1, period: 'CURRENT' },
        { awayScore: 1, homeScore: 1, period: 'PERIOD_1' },
      ],
      sport: 'FOOTBALL',
      sportEvent: 'Y',
      sportEventStatus: 'REMOVED',
      startTime: '2024-03-04T10:36:07.812Z',
    },
    {
      awayCompetitor: 'AwayZ',
      competition: 'CompZ',
      homeCompetitor: 'HomeZ',
      scores: [
        { awayScore: 3, homeScore: 4, period: 'CURRENT' },
        { awayScore: 3, homeScore: 4, period: 'PERIOD_1' },
      ],
      sport: 'FOOTBALL',
      sportEvent: 'Z',
      sportEventStatus: 'LIVE',
      startTime: '2024-03-04T10:36:07.812Z',
    },
  ],
  state: {
    X: {
      competition: 'CompX',
      competitors: {
        AWAY: {
          name: 'AwayX',
          type: 'AWAY',
        },
        HOME: {
          name: 'HomeX',
          type: 'HOME',
        },
      },
      id: 'X',
      scores: {
        CURRENT: {
          away: '2',
          home: '4',
          type: 'CURRENT',
        },
        PERIOD_1: {
          away: '1',
          home: '2',
          type: 'PERIOD_1',
        },
        PERIOD_2: {
          away: '2',
          home: '4',
          type: 'PERIOD_2',
        },
      },
      sport: 'FOOTBALL',
      startTime: '2024-03-04T10:36:07.812Z',
      status: 'LIVE',
    },
    Z: {
      competition: 'CompZ',
      competitors: {
        AWAY: {
          name: 'AwayZ',
          type: 'AWAY',
        },
        HOME: {
          name: 'HomeZ',
          type: 'HOME',
        },
      },
      id: 'Z',
      scores: {
        CURRENT: {
          away: '3',
          home: '4',
          type: 'CURRENT',
        },
        PERIOD_1: {
          away: '3',
          home: '4',
          type: 'PERIOD_1',
        },
      },
      sport: 'FOOTBALL',
      startTime: '2024-03-04T10:36:07.812Z',
      status: 'LIVE',
    },
  },
} satisfies {
  odds: Odds;
  state: ClientState;
};

describe('converters', () => {
  describe('parseMappings', () => {
    it('should fail for invalid input', () => {
      const input = 'a:b;c:d;;;invalid input';
      expect(() => parseMappings(input)).toThrow();
    });
    it('should parse simplified input', () => {
      const input = 'a:b;c:d;e:valid input';
      const mapping = parseMappings(input);
      const value = mapping.get('c');
      expect(value).toBe('d');
    });
    it('should parse example input', () => {
      const mapping = parseMappings(mappingExample.raw);
      const value = mapping.get(mappingExample.id);
      expect(value).toBe(mappingExample.value);
    });
  });

  describe('parseScoresRecordOrig', () => {
    it('should return undefined for empty input', () => {
      const result = parseScoresRecordOrig('');
      expect(result).toEqual(undefined);
    });

    it('should parse example input', () => {
      const result = parseScoresRecordOrig(scoresRecordsIdsExample.raw);
      expect(result).toEqual(scoresRecordsIdsExample.result);
    });
  });

  describe('parseScoresOrig', () => {
    it('should return empty array for empty input', () => {
      const result = parseScoresOrig('');
      expect(result).toEqual([]);
    });

    it('should parse example input', () => {
      const result = parseScoresOrig(scoresIdsExamle.raw);
      expect(result).toEqual(scoresIdsExamle.result);
    });
  });

  describe('parseOddsOrig', () => {
    it('should parse example input', () => {
      const result = parseOddsOrig(oddsIdsExamle.raw);
      expect(result).toEqual(oddsIdsExamle.result);
    });

    it('should fail on invalid data', () => {
      expect(() => parseOddsOrig(oddsIdsExampleIncomplete)).toThrow();
    });
  });

  describe('convertOrigToTargetOdds', () => {
    it('should convert orig odds to target odds with mapping', () => {
      const { mapping, orig, target } = origToTargetOddsSimplified;
      const result = convertOrigToTargetOdds(orig, mapping);
      expect(result).toEqual(target);
    });
  });

  describe('convertTargetOddsToClientState', () => {
    it('should convert example odds to client state', () => {
      const { odds, state } = targetOddsToClientStateExample;
      const result = convertTargetOddsToClientState(odds);
      expect(result).toEqual(state);
    });

    it('should skip removed and convert multiple values', () => {
      const { odds, state } = targetOddsToClientStateMultiple;
      const result = convertTargetOddsToClientState(odds);
      expect(result).toEqual(state);
    });
  });
});
