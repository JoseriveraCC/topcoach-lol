import type { EvaluationHistoryItem, EvaluationPriority, MatchSummary, TrainingGoal } from "../types";
import { Panel, ProgressBar, StatusBadge } from "./ui";

export function MetricCard({ value, label, detail }: { value: string; label: string; detail?: string }) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {detail && <p>{detail}</p>}
    </article>
  );
}

export function MatchRow({ match }: { match: MatchSummary }) {
  const resultClass = match.result === "Victoria" ? "result--win" : "result--loss";

  return (
    <article className="match-row">
      <div>
        <strong>{match.champion}</strong>
        <span className="match-row__meta">{match.playedAt} · Ranked Solo/Duo</span>
      </div>
      <strong className={resultClass}>{match.result}</strong>
      <span className="match-row__secondary">{match.kills}/{match.deaths}/{match.assists} KDA</span>
      <span className="match-row__secondary">{match.csPerMinute} CS/min</span>
    </article>
  );
}

const severityTone = {
  "Atención": "warning",
  "Crítico": "danger",
  "Bien": "success",
} as const;

export function PriorityCard({ priority, index }: { priority: EvaluationPriority; index: number }) {
  return (
    <Panel className="priority-card">
      <div className="card-heading">
        <span className="priority-index">Prioridad {index + 1}</span>
        <StatusBadge tone={severityTone[priority.severity]}>{priority.severity}</StatusBadge>
      </div>
      <h3>{priority.title}</h3>
      <dl className="priority-metrics">
        <div><dt>Valor observado</dt><dd>{priority.observedValue}</dd></div>
        <div><dt>Referencia</dt><dd>{priority.reference}</dd></div>
      </dl>
      <p>{priority.explanation}</p>
      <p className="card-note"><strong>Limitación:</strong> {priority.limitation}</p>
      <p className="priority-goal"><strong>Meta:</strong> {priority.goal}</p>
    </Panel>
  );
}

export function EvaluationCard({ item }: { item: EvaluationHistoryItem }) {
  return (
    <Panel className="evaluation-card">
      <div className="card-heading">
        <span className="eyebrow">Bloque {item.id}</span>
        <StatusBadge tone="success">{item.status}</StatusBadge>
      </div>
      <h3>{item.primaryFocus}</h3>
      <p>{item.dateRange}</p>
      <ProgressBar value={item.score} max={100} label="Puntuación de consistencia" />
      <a className="card-link" href={`#/evaluacion/${item.id}`}>Ver evaluación</a>
    </Panel>
  );
}

export function TrainingGoalCard({ goal, checked, onToggle }: { goal: TrainingGoal; checked: boolean; onToggle: () => void }) {
  return (
    <label className={`training-goal ${checked ? "training-goal--checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        aria-label={`Partida ${goal.matchNumber}: ${goal.title}`}
      />
      <span>
        <strong>Partida {goal.matchNumber} · {goal.title}</strong>
        <small>{goal.instruction}</small>
      </span>
    </label>
  );
}
