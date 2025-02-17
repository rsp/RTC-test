export type Mapping = Map<string, string>;

/**
 * The types with "Ids" suffix are teh ones that don't have the IDs substituted.
 */
export type Odds = OddsRecord[];
export type OddsIds = OddsRecordIds[];

export interface OddsRecord {
  awayCompetitor: string;
  competition: string;
  homeCompetitor: string;
  scores: OddsScores[];
  sport: string;
  sportEvent: string;
  sportEventStatus: string;
  startTime: string;
}

export interface OddsRecordIds {
  awayCompetitorId: string;
  competitionId: string;
  homeCompetitorId: string;
  scores: OddsScoresIds[];
  sportEventId: string;
  sportEventStatusId: string;
  sportId: string;
  startTime: string;
}

export interface OddsScores {
  awayScore: number;
  homeScore: number;
  period: string;
}

export interface OddsScoresIds {
  awayScore: number;
  homeScore: number;
  periodId: string;
}

const MAPPINGS_RECORD_SEPARATOR = ';';
const MAPPINGS_FIELD_SEPARATOR = ':';

const ODDS_RECORD_SEPARATOR = '\n';
const ODDS_FIELD_SEPARATOR = ',';
const ODDS_SCORES_SEPARATOR = '|';
const ODDS_SCORES_REGEX = /^([\w-]+)@(\d+):(\d+)$/;

export function parseMappings(input: string): Mapping {
  const mapping: Mapping = new Map();
  for (const record of input.split(MAPPINGS_RECORD_SEPARATOR)) {
    const [id, value] = record.split(MAPPINGS_FIELD_SEPARATOR);
    if (!id || !value) {
      throw new Error(`Error parsing mapping for record: "${record}"`);
    }
    mapping.set(id, value);
  }
  return mapping;
}

export function parseOddsIds(input: string): OddsIds {
  const odds: OddsIds = [];
  for (const record of input.split(ODDS_RECORD_SEPARATOR)) {
    const [
      sportEventId,
      sportId,
      competitionId,
      startTime,
      homeCompetitorId,
      awayCompetitorId,
      sportEventStatusId,
      scoresString,
    ] = record.split(ODDS_FIELD_SEPARATOR);
    if (
      !sportEventId ||
      !sportId ||
      !competitionId ||
      !startTime ||
      !homeCompetitorId ||
      !awayCompetitorId ||
      !sportEventStatusId
    ) {
      throw new Error(`Error parsing odds for record: "${record}"`);
    }
    const scores = parseScoresIds(scoresString);
    const oddsIdsRecord = {
      awayCompetitorId,
      competitionId,
      homeCompetitorId,
      scores,
      sportEventId,
      sportEventStatusId,
      sportId,
      startTime,
    };
    odds.push(oddsIdsRecord);
  }
  return odds;
}

export function parseScoresIds(scoresString: string): OddsScoresIds[] {
  const records = scoresString.split(ODDS_SCORES_SEPARATOR);
  const scores: OddsScoresIds[] = records
    .map(parseScoresRecordIds)
    .filter((value): value is OddsScoresIds => value !== undefined);
  return scores;
}

export function parseScoresRecordIds(scoresRecordString: string): OddsScoresIds | undefined {
  const match = ODDS_SCORES_REGEX.exec(scoresRecordString);
  if (match) {
    const scores: OddsScoresIds = {
      awayScore: Number(match[3]),
      homeScore: Number(match[2]),
      periodId: match[1],
    };
    return scores;
  }
}
