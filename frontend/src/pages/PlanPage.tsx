import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { TrainingGoalCard } from "../components/domain";
import { PageHeader, Panel, ProgressBar, StatusBadge } from "../components/ui";
import { demoEvaluation } from "../data/demo";

export function PlanPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const priority = demoEvaluation.priorities[0];

  const toggleGoal = (matchNumber: number) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(matchNumber)) next.delete(matchNumber);
      else next.add(matchNumber);
      return next;
    });
  };

  return (
    <AppShell activeRoute="/plan">
      <PageHeader
        eyebrow="Práctica guiada inmediata"
        title="Plan de 3 partidas"
        description="Convertí la prioridad principal del último bloque en un hábito concreto para tus próximas partidas."
      />

      <div className="plan-grid">
        <Panel className="plan-summary">
          <div className="card-heading">
            <p className="eyebrow">Prioridad principal</p>
            <StatusBadge tone="danger">{priority.severity}</StatusBadge>
          </div>
          <h2>{priority.title}</h2>
          <p className="plan-target"><strong>Meta:</strong> {priority.goal}</p>
          <ProgressBar value={completed.size} max={3} label="Progreso del plan" />
          <strong className="plan-completed">{completed.size}/3 completadas</strong>
        </Panel>

        <Panel className="plan-note" accent={false}>
          <StatusBadge tone="neutral">Seguimiento local de demostración</StatusBadge>
          <h2>Práctica breve, reevaluación completa</h2>
          <p>Este plan sirve para practicar un hábito inmediato. Una reevaluación completa requiere 10 partidas nuevas válidas.</p>
        </Panel>
      </div>

      <section aria-labelledby="training-goals-title">
        <div className="section-heading">
          <div><p className="eyebrow">Checklist local</p><h2 id="training-goals-title">Objetivos por partida</h2></div>
          <span>No se guarda al salir</span>
        </div>
        <div className="training-list">
          {demoEvaluation.trainingGoals.map((goal) => (
            <TrainingGoalCard
              key={goal.matchNumber}
              goal={goal}
              checked={completed.has(goal.matchNumber)}
              onToggle={() => toggleGoal(goal.matchNumber)}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
