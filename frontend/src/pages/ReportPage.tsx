import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { MetricCard, PriorityCard } from "../components/domain";
import { Panel, StatusBadge, Tabs } from "../components/ui";
import { demoEvaluation, demoMatches } from "../data/demo";

const reportTabs = ["Resumen", "Debilidades", "Evidencia", "Plan de 3 partidas"] as const;
type ReportTab = (typeof reportTabs)[number];

export function ReportPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("Resumen");

  return (
    <AppShell activeRoute="/evaluacion/4">
      <header className="report-heading">
        <div>
          <p className="eyebrow">Informe demostrativo · {demoEvaluation.dateRange}</p>
          <h1>Tu siguiente mejora empieza acá</h1>
          <div className="report-heading__meta">
            <StatusBadge tone="success">Evaluación completada</StatusBadge>
            <strong>10 partidas válidas</strong>
            <span>Ranked Solo/Duo · Top Lane · queueId 420</span>
          </div>
        </div>
        <div className="report-score">
          <strong>{demoEvaluation.consistencyScore}</strong>
          <span>Índice demostrativo de consistencia</span>
        </div>
      </header>

      <Tabs items={reportTabs} active={activeTab} onChange={(tab) => setActiveTab(tab as ReportTab)} />

      <div className="report-tabpanel" role="tabpanel" aria-label={activeTab}>
        {activeTab === "Resumen" && (
          <>
            <section className="metric-grid report-metrics" aria-label="Métricas del bloque">
              <MetricCard value={demoEvaluation.averageKda.toFixed(1)} label="KDA promedio" detail="Bloque de 10 partidas" />
              <MetricCard value={`${demoEvaluation.winRate}%`} label="Win rate" detail="Ranked Solo/Duo" />
              <MetricCard value={demoEvaluation.csPerMinute.toFixed(1)} label="CS por minuto" detail="Promedio observado" />
              <MetricCard value={String(demoMatches.length)} label="Partidas analizadas" detail="Top Lane · queueId 420" />
            </section>
            <div className="report-grid">
              <section aria-labelledby="primary-priority-title">
                <div className="section-heading">
                  <div><p className="eyebrow">Prioridad principal</p><h2 id="primary-priority-title">Qué practicar ahora</h2></div>
                </div>
                <PriorityCard priority={demoEvaluation.priorities[0]} index={0} />
              </section>
              <Panel className="report-note" accent={false}>
                <p className="eyebrow">Cómo leer este resultado</p>
                <h2>Evidencia, no una promesa de rango</h2>
                <p>El índice resume consistencia dentro de este bloque demostrativo. No estima habilidad, ELO ni resultados futuros.</p>
              </Panel>
            </div>
          </>
        )}

        {activeTab === "Debilidades" && (
          <section aria-labelledby="weaknesses-title">
            <div className="section-heading">
              <div><p className="eyebrow">Hallazgos priorizados</p><h2 id="weaknesses-title">Debilidades observadas</h2></div>
            </div>
            <div className="report-priorities">
              {demoEvaluation.priorities.map((priority, index) => (
                <PriorityCard key={priority.id} priority={priority} index={index} />
              ))}
            </div>
          </section>
        )}

        {activeTab === "Evidencia" && (
          <section aria-labelledby="evidence-title">
            <div className="section-heading">
              <div><p className="eyebrow">Trazabilidad · 10 partidas</p><h2 id="evidence-title">Evidencia del bloque</h2></div>
            </div>
            <Panel className="evidence-panel">
              <p className="report-note">Muertes registradas antes del minuto 15. La altura facilita la comparación; cada barra conserva su valor en una etiqueta accesible.</p>
              <div className="evidence-chart" aria-label="Muertes tempranas por partida">
                {demoMatches.map((match, index) => (
                  <div
                    key={match.id}
                    className={`evidence-bar ${match.earlyDeaths >= 2 ? "evidence-bar--critical" : ""}`}
                    style={{ height: `${Math.max(8, (match.earlyDeaths / 3) * 100)}%` }}
                    role="img"
                    aria-label={`Partida ${index + 1}: ${match.earlyDeaths} muertes tempranas`}
                  />
                ))}
              </div>
              <ol className="evidence-list" aria-label="Detalle de las diez partidas válidas">
                {demoMatches.map((match, index) => (
                  <li key={match.id}>
                    <span>Partida {index + 1} · {match.champion}</span>
                    <strong>{match.earlyDeaths} muertes tempranas</strong>
                    <small>{match.result} · {match.csPerMinute} CS/min · queueId {match.queueId} · {match.role}</small>
                  </li>
                ))}
              </ol>
            </Panel>
            <p className="report-note">Limitación: estos datos muestran patrones del bloque, pero no explican por sí solos la causa táctica de cada muerte.</p>
          </section>
        )}

        {activeTab === "Plan de 3 partidas" && (
          <section aria-labelledby="practice-plan-title">
            <div className="section-heading">
              <div><p className="eyebrow">Práctica guiada inmediata</p><h2 id="practice-plan-title">Próximas 3 partidas</h2></div>
            </div>
            <ol className="report-goals">
              {demoEvaluation.trainingGoals.map((goal) => (
                <li key={goal.matchNumber}>
                  <span>0{goal.matchNumber}</span>
                  <div><strong>{goal.title}</strong><p>{goal.instruction}</p></div>
                </li>
              ))}
            </ol>
            <p className="report-note">Una reevaluación requiere 10 partidas nuevas válidas.</p>
          </section>
        )}
      </div>
    </AppShell>
  );
}
