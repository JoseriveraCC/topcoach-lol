import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { EvaluationCard } from "../components/domain";
import { Button, PageHeader, Panel } from "../components/ui";
import { demoHistory } from "../data/demo";

export function HistoryPage() {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <AppShell activeRoute="/historial">
      <PageHeader
        eyebrow="Progreso entre bloques"
        title="Historial de evaluaciones"
        description="Compará el foco y la consistencia observada en cada bloque demostrativo de 10 partidas válidas."
        action={<Button variant="secondary" className="history-empty-toggle" onClick={() => setShowEmpty((current) => !current)}>{showEmpty ? "Mostrar historial" : "Mostrar estado vacío"}</Button>}
      />

      {showEmpty ? (
        <Panel className="history-empty">
          <p className="eyebrow">Estado vacío demostrativo</p>
          <h2>Todavía no hay evaluaciones</h2>
          <p>Completá un primer bloque de 10 partidas válidas para empezar a comparar tu progreso.</p>
          <Button href="#/evaluacion/nueva">Crear primera evaluación</Button>
        </Panel>
      ) : (
        <>
          <Panel className="history-comparison" accent={false}>
            <div>
              <p className="eyebrow">Puntuación de consistencia</p>
              <h2>Movimiento entre evaluaciones</h2>
              <p>Tres bloques independientes de 10 partidas válidas.</p>
            </div>
            <strong aria-label="La puntuación subió de 64 a 68 y luego a 74">64 <span>→</span> 68 <span>→</span> 74</strong>
          </Panel>

          <section aria-labelledby="history-list-title">
            <div className="section-heading">
              <div><p className="eyebrow">Datos demostrativos</p><h2 id="history-list-title">Evaluaciones anteriores</h2></div>
              <span>3 bloques completados</span>
            </div>
            <div className="history-list">
              {demoHistory.map((item) => (
                <EvaluationCard
                  key={item.id}
                  item={item}
                  detailHref={item.id === "4" ? "#/evaluacion/4" : undefined}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
