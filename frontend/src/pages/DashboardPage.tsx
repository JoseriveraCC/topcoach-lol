import { AppShell } from "../components/AppShell";
import { MatchRow, MetricCard, PriorityCard } from "../components/domain";
import { Button, PageHeader, Panel } from "../components/ui";
import { demoEvaluation, demoMatches, demoUser } from "../data/demo";

export function DashboardPage() {
  return (
    <AppShell activeRoute="/dashboard">
      <PageHeader
        eyebrow="Resumen de entrenamiento"
        title="Tu entrenamiento, en contexto"
        description="Revisá el bloque demostrativo de 10 partidas y convertí la evidencia en una prioridad concreta."
        action={<Button href="#/evaluacion/nueva">Solicitar evaluación</Button>}
      />

      <Panel className="profile-panel">
        <div>
          <p className="eyebrow">Perfil de League of Legends · Demo</p>
          <h2>{demoUser.summonerName} #{demoUser.tagLine}</h2>
          <p>{demoUser.region} · Top Lane · Ranked Solo/Duo</p>
        </div>
        <div className="profile-rank">
          <strong>{demoUser.rank}</strong>
          <span>{demoUser.leaguePoints} LP</span>
          <span>{demoUser.wins}W {demoUser.losses}L</span>
        </div>
      </Panel>

      <section className="metric-grid" aria-label="Métricas del bloque demostrativo">
        <MetricCard value={demoEvaluation.averageKda.toFixed(1)} label="KDA promedio" detail="10 partidas" />
        <MetricCard value={`${demoEvaluation.winRate}%`} label="Win rate" detail="Ranked Solo/Duo" />
        <MetricCard value={demoEvaluation.csPerMinute.toFixed(1)} label="CS por minuto" detail="Promedio del bloque" />
        <MetricCard value={String(demoMatches.length)} label="Partidas analizadas" detail="Bloque completo" />
      </section>

      <div className="dashboard-grid">
        <Panel className="recent-matches">
          <div className="section-heading">
            <div><p className="eyebrow">Evidencia reciente · Demo</p><h2>Últimas partidas</h2></div>
            <span>4 de 10</span>
          </div>
          <div aria-label="Partidas recientes demostrativas">
            {demoMatches.slice(0, 4).map((match) => <MatchRow key={match.id} match={match} />)}
          </div>
        </Panel>

        <section className="current-focus" aria-labelledby="current-focus-title">
          <div className="section-heading">
            <div><p className="eyebrow">Evaluación actual</p><h2 id="current-focus-title">Foco principal</h2></div>
          </div>
          <PriorityCard priority={demoEvaluation.priorities[0]} index={0} />
        </section>
      </div>
    </AppShell>
  );
}
