export type Mapping = Map<string, string>;

/**
 * The types with "Orig" suffix are the ones that don't have the IDs substituted
 * and have original date formats.
 */
export type Odds = OddsRecord[];
export type OddsOrig = OddsRecordOrig[];

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

export interface OddsRecordOrig {
  awayCompetitorId: string;
  competitionId: string;
  homeCompetitorId: string;
  scores: OddsScoresOrig[];
  sportEventId: string;
  sportEventStatusId: string;
  sportId: string;
  startTime: number;
}

export interface OddsScores {
  awayScore: number;
  homeScore: number;
  period: string;
}

export interface OddsScoresOrig {
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

/**
 * Maps IDs to names. Keeps the ID if the name cannot be found in the mapping.
 */
export class IdMapper {
  constructor(private mapping: Mapping) {}
  id(id: string): string {
    return this.mapping.get(id) ?? id;
  }
}

export function convertOrigToTargetOdds(oddsOrig: OddsOrig, mapping: Mapping): Odds {
  const mapper = new IdMapper(mapping);
  const odds: Odds = oddsOrig.map((recordOrig) => ({
    awayCompetitor: mapper.id(recordOrig.awayCompetitorId),
    competition: mapper.id(recordOrig.competitionId),
    homeCompetitor: mapper.id(recordOrig.homeCompetitorId),
    scores: recordOrig.scores.map((score) => ({
      awayScore: score.awayScore,
      homeScore: score.homeScore,
      period: mapper.id(score.periodId),
    })),
    sport: mapper.id(recordOrig.sportId),
    sportEvent: mapper.id(recordOrig.sportEventId),
    sportEventStatus: mapper.id(recordOrig.sportEventStatusId),
    startTime: new Date(recordOrig.startTime).toISOString(),
  }));
  return odds;
}

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

export function parseOddsOrig(input: string): OddsOrig {
  const odds: OddsOrig = [];
  for (const record of input.split(ODDS_RECORD_SEPARATOR)) {
    const [
      sportEventId,
      sportId,
      competitionId,
      startTimeRaw,
      homeCompetitorId,
      awayCompetitorId,
      sportEventStatusId,
      scoresString,
    ] = record.split(ODDS_FIELD_SEPARATOR);
    if (
      !sportEventId ||
      !sportId ||
      !competitionId ||
      !startTimeRaw ||
      !homeCompetitorId ||
      !awayCompetitorId ||
      !sportEventStatusId
    ) {
      throw new Error(`Error parsing odds for record: "${record}"`);
    }
    const scores = parseScoresOrig(scoresString);
    const startTime = Number(startTimeRaw);
    const oddsOrigRecord = {
      awayCompetitorId,
      competitionId,
      homeCompetitorId,
      scores,
      sportEventId,
      sportEventStatusId,
      sportId,
      startTime,
    };
    odds.push(oddsOrigRecord);
  }
  return odds;
}

export function parseScoresOrig(scoresString: string): OddsScoresOrig[] {
  const records = scoresString.split(ODDS_SCORES_SEPARATOR);
  const scores: OddsScoresOrig[] = records
    .map(parseScoresRecordOrig)
    .filter((value): value is OddsScoresOrig => value !== undefined);
  return scores;
}

export function parseScoresRecordOrig(scoresRecordString: string): OddsScoresOrig | undefined {
  const match = ODDS_SCORES_REGEX.exec(scoresRecordString);
  if (match) {
    const scores: OddsScoresOrig = {
      awayScore: Number(match[3]),
      homeScore: Number(match[2]),
      periodId: match[1],
    };
    return scores;
  }
}
