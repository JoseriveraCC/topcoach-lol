export type MatchResult = "Victoria" | "Derrota";
export type Severity = "Atención" | "Crítico" | "Bien";

export interface DemoUser {
  summonerName: string;
  tagLine: string;
  region: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export interface MatchSummary {
  id: string;
  champion: string;
  queueId: 420;
  role: "TOP";
  result: MatchResult;
  kills: number;
  deaths: number;
  assists: number;
  csPerMinute: number;
  earlyDeaths: number;
  playedAt: string;
}

export interface EvaluationPriority {
  id: string;
  title: string;
  severity: Severity;
  observedValue: string;
  reference: string;
  explanation: string;
  limitation: string;
  goal: string;
}

export interface TrainingGoal {
  matchNumber: 1 | 2 | 3;
  title: string;
  instruction: string;
}

export interface EvaluationSummary {
  id: string;
  status: "completed";
  dateRange: string;
  consistencyScore: number;
  averageKda: number;
  winRate: number;
  csPerMinute: number;
  priorities: EvaluationPriority[];
  trainingGoals: TrainingGoal[];
  newMatchesRequiredForReevaluation: 10;
}

export interface EvaluationHistoryItem {
  id: string;
  dateRange: string;
  score: number;
  primaryFocus: string;
  status: "Completada";
}
