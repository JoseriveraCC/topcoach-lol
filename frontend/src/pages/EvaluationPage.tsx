import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { Button, PageHeader, Panel, ProgressBar, StatusBadge } from "../components/ui";

type CollectionState = "partial" | "ready" | "processing" | "failed" | "completed";

const validityRules = [
  "Solo partidas de Ranked Solo/Duo (queueId 420).",
  "La posición registrada debe ser Top Lane.",
  "El análisis comienza al reunir exactamente 10 partidas válidas.",
];

export function EvaluationPage() {
  const [collectionState, setCollectionState] = useState<CollectionState>("partial");
  const collectedMatches = collectionState === "partial" || collectionState === "failed" ? 7 : 10;

  return (
    <AppShell activeRoute="/evaluacion/nueva">
      <PageHeader
        eyebrow="Bloque de evaluación · Demo"
        title="Nueva evaluación"
        description="Reuní un bloque comparable antes de generar recomendaciones basadas en evidencia."
      />

      <Panel className="evaluation-state">
        <div className="evaluation-state__heading">
          <div>
            <p className="eyebrow">Ranked Solo/Duo · Top Lane · queueId 420</p>
            {collectionState === "partial" && <h2>7 partidas válidas encontradas</h2>}
            {collectionState === "ready" && <h2>10 partidas listas para analizar</h2>}
            {collectionState === "processing" && <h2>Analizando métricas y reglas</h2>}
            {collectionState === "failed" && <h2>No pudimos sincronizar las partidas</h2>}
            {collectionState === "completed" && <h2>Evaluación completada</h2>}
          </div>
          {collectionState === "completed" ? (
            <StatusBadge tone="success">Completada</StatusBadge>
          ) : collectionState === "failed" ? (
            <StatusBadge tone="danger">Error recuperable</StatusBadge>
          ) : (
            <StatusBadge tone="neutral">Datos demostrativos</StatusBadge>
          )}
        </div>

        <ProgressBar value={collectedMatches} max={10} label="Partidas válidas" />

        <ul className="rule-list" aria-label="Reglas de validez">
          {validityRules.map((rule) => <li key={rule}>{rule}</li>)}
        </ul>

        {collectionState === "failed" && (
          <p className="evaluation-alert" role="alert">
            La sincronización demo se interrumpió. Tus 7 partidas válidas siguen disponibles y podés reintentar sin perder el progreso.
          </p>
        )}

        <div className="evaluation-state__actions">
          {collectionState === "partial" && (
            <Button type="button" onClick={() => setCollectionState("ready")}>Simular 10 partidas</Button>
          )}
          {collectionState === "ready" && (
            <Button type="button" onClick={() => setCollectionState("processing")}>Generar evaluación demo</Button>
          )}
          {collectionState === "processing" && (
            <Button type="button" onClick={() => setCollectionState("completed")}>Completar análisis</Button>
          )}
          {collectionState === "completed" && <Button href="#/evaluacion/4">Abrir informe</Button>}
          {collectionState === "failed" ? (
            <Button type="button" onClick={() => setCollectionState("partial")}>Reintentar sincronización</Button>
          ) : collectionState !== "completed" && (
            <Button type="button" variant="secondary" onClick={() => setCollectionState("failed")}>Simular error</Button>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
