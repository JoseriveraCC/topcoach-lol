import type {
  DemoUser,
  EvaluationHistoryItem,
  EvaluationSummary,
  MatchSummary,
} from "../types";

export const demoUser: DemoUser = {
  summonerName: "TP Salchipapa",
  tagLine: "3192",
  region: "LAS",
  rank: "Diamante IV",
  leaguePoints: 62,
  wins: 48,
  losses: 41,
};

export const demoMatches: MatchSummary[] = [
  { id: "LA2-1001", champion: "Aatrox", queueId: 420, role: "TOP", result: "Victoria", kills: 8, deaths: 2, assists: 11, csPerMinute: 8.1, earlyDeaths: 0, playedAt: "16 Sep" },
  { id: "LA2-1002", champion: "Jax", queueId: 420, role: "TOP", result: "Victoria", kills: 12, deaths: 4, assists: 6, csPerMinute: 7.8, earlyDeaths: 1, playedAt: "16 Sep" },
  { id: "LA2-1003", champion: "Gwen", queueId: 420, role: "TOP", result: "Derrota", kills: 3, deaths: 6, assists: 9, csPerMinute: 6.9, earlyDeaths: 2, playedAt: "15 Sep" },
  { id: "LA2-1004", champion: "Camille", queueId: 420, role: "TOP", result: "Victoria", kills: 9, deaths: 3, assists: 8, csPerMinute: 7.6, earlyDeaths: 1, playedAt: "15 Sep" },
  { id: "LA2-1005", champion: "Ornn", queueId: 420, role: "TOP", result: "Derrota", kills: 2, deaths: 5, assists: 12, csPerMinute: 6.7, earlyDeaths: 2, playedAt: "14 Sep" },
  { id: "LA2-1006", champion: "Renekton", queueId: 420, role: "TOP", result: "Victoria", kills: 7, deaths: 4, assists: 5, csPerMinute: 7.7, earlyDeaths: 2, playedAt: "14 Sep" },
  { id: "LA2-1007", champion: "Kennen", queueId: 420, role: "TOP", result: "Victoria", kills: 6, deaths: 2, assists: 10, csPerMinute: 7.5, earlyDeaths: 0, playedAt: "13 Sep" },
  { id: "LA2-1008", champion: "Malphite", queueId: 420, role: "TOP", result: "Derrota", kills: 2, deaths: 7, assists: 8, csPerMinute: 6.4, earlyDeaths: 3, playedAt: "13 Sep" },
  { id: "LA2-1009", champion: "Fiora", queueId: 420, role: "TOP", result: "Victoria", kills: 10, deaths: 3, assists: 4, csPerMinute: 8.3, earlyDeaths: 1, playedAt: "12 Sep" },
  { id: "LA2-1010", champion: "Shen", queueId: 420, role: "TOP", result: "Derrota", kills: 3, deaths: 6, assists: 13, csPerMinute: 7.0, earlyDeaths: 2, playedAt: "12 Sep" },
];

export const demoEvaluation: EvaluationSummary = {
  id: "4",
  status: "completed",
  dateRange: "12–16 Sep 2026",
  consistencyScore: 74,
  averageKda: 4.2,
  winRate: 62,
  csPerMinute: 7.4,
  newMatchesRequiredForReevaluation: 10,
  priorities: [
    {
      id: "early-deaths",
      title: "Reducir muertes antes del minuto 15",
      severity: "Crítico",
      observedValue: "1.8 por partida",
      reference: "≤ 1.0 por partida",
      explanation: "La frecuencia observada sugiere revisar la toma de riesgos sin visión durante la fase de líneas.",
      limitation: "Los datos no permiten afirmar la causa táctica exacta sin revisar la partida.",
      goal: "Máximo 1 muerte antes del minuto 15 en cada una de las próximas 3 partidas.",
    },
    {
      id: "farm-consistency",
      title: "Estabilizar el farmeo",
      severity: "Atención",
      observedValue: "7.4 CS/min; variación 18%",
      reference: "Variación ≤ 12%",
      explanation: "La variación sugiere que conviene revisar qué decisiones reducen el acceso constante a súbditos.",
      limitation: "CS/min no mide por sí solo la calidad de wave management.",
      goal: "Mantener al menos 7.2 CS/min en 2 de las próximas 3 partidas.",
    },
  ],
  trainingGoals: [
    { matchNumber: 1, title: "Priorizar supervivencia", instruction: "No disputar la oleada sin visión cuando el jungla rival no esté ubicado." },
    { matchNumber: 2, title: "Repetir la meta", instruction: "Mantener máximo una muerte antes del minuto 15 y registrar el contexto." },
    { matchNumber: 3, title: "Consolidar el hábito", instruction: "Comparar la toma de riesgos con las dos partidas anteriores." },
  ],
};

export const demoHistory: EvaluationHistoryItem[] = [
  { id: "4", dateRange: "12–16 Sep 2026", score: 74, primaryFocus: "Muertes tempranas", status: "Completada" },
  { id: "3", dateRange: "01–05 Sep 2026", score: 68, primaryFocus: "Consistencia de farmeo", status: "Completada" },
  { id: "2", dateRange: "20–24 Ago 2026", score: 64, primaryFocus: "Participación en objetivos", status: "Completada" },
];

export const visualTokens = [
  ["Vacío", "#050B0F", "Fondo principal"],
  ["Superficie", "#0D171D", "Tarjetas y navegación"],
  ["Línea", "#23343C", "Bordes y divisores"],
  ["Texto", "#F2F7F8", "Contenido principal"],
  ["Acción", "#43D8CD", "Acciones y selección"],
  ["Progreso", "#E7B761", "Rango y logros"],
  ["Alerta", "#EF6156", "Métricas críticas"],
] as const;
