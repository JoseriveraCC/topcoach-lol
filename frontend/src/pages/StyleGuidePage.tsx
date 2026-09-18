import { useState } from "react";
import { AppShell } from "../components/AppShell";
import { MetricCard } from "../components/domain";
import { Button, EmptyState, Panel, ProgressBar, StatusBadge, Tabs } from "../components/ui";
import { visualTokens } from "../data/demo";

export function StyleGuidePage() {
  const [activeGuideTab, setActiveGuideTab] = useState("Vista general");

  return (
    <AppShell activeRoute="/guia-visual">
      <div className="style-guide capture-frame">
        <header className="guide-header">
          <div>
            <p className="eyebrow">Guía de producto y presentación</p>
            <h1>Sistema visual</h1>
            <p>Componentes reales del prototipo, listos para documentar decisiones y mantener consistencia.</p>
          </div>
          <StatusBadge tone="neutral">Preparado para capturas 16:9</StatusBadge>
        </header>

        <section className="guide-section" aria-labelledby="palette-title">
          <div className="section-heading">
            <div><p className="eyebrow">Paleta</p><h2 id="palette-title">Tokens de color</h2></div>
            <span>HEX exacto</span>
          </div>
          <div className="swatch-grid">
            {visualTokens.map(([name, value, usage]) => (
              <article className="swatch" key={name}>
                <div className="swatch__color" style={{ backgroundColor: value }} aria-hidden="true" />
                <div className="swatch__meta"><strong>{name}</strong><span>{value}</span><small>{usage}</small></div>
              </article>
            ))}
          </div>
        </section>

        <div className="guide-components">
          <section className="guide-section" aria-labelledby="type-title">
            <Panel>
              <p className="eyebrow">Escala tipográfica</p>
              <h2 id="type-title">Tipografía</h2>
              <div className="type-samples">
                <div><strong className="type-sample-title">Rajdhani</strong><span>Títulos · 700</span></div>
                <div><strong className="type-sample-body">IBM Plex Mono</strong><span>Datos y cuerpo · 500</span></div>
              </div>
            </Panel>
          </section>

          <section className="guide-section" aria-labelledby="buttons-title">
            <Panel>
              <p className="eyebrow">Acciones</p>
              <h2 id="buttons-title">Botones</h2>
              <div className="guide-row">
                <Button type="button">Acción primaria</Button>
                <Button type="button" variant="secondary">Acción secundaria</Button>
                <Button type="button" variant="link">Acción de texto</Button>
              </div>
            </Panel>
          </section>

          <section className="guide-section" aria-labelledby="states-title">
            <Panel>
              <p className="eyebrow">Semántica visible</p>
              <h2 id="states-title">Estados</h2>
              <div className="guide-row">
                <StatusBadge tone="success">Completada</StatusBadge>
                <StatusBadge tone="warning">Atención</StatusBadge>
                <StatusBadge tone="danger">Crítico</StatusBadge>
                <StatusBadge tone="neutral">Neutral</StatusBadge>
                <StatusBadge tone="process">En proceso</StatusBadge>
              </div>
              <ProgressBar value={7} max={10} label="Progreso de ejemplo" />
            </Panel>
          </section>

          <section className="guide-section" aria-labelledby="metrics-title">
            <Panel>
              <p className="eyebrow">Lectura rápida</p>
              <h2 id="metrics-title">Métricas</h2>
              <div className="guide-metrics">
                <MetricCard value="74" label="Consistencia" detail="Índice demostrativo" />
                <MetricCard value="7.4" label="CS por minuto" detail="Promedio observado" />
              </div>
            </Panel>
          </section>

          <section className="guide-section guide-section--wide" aria-labelledby="surfaces-title">
            <Panel>
              <p className="eyebrow">Composición</p>
              <h2 id="surfaces-title">Superficies</h2>
              <p className="guide-copy">Panel angular elevado, borde técnico y acento superior para agrupar información relacionada.</p>
              <label className="field">
                Riot ID de ejemplo
                <input type="text" placeholder="Nombre #TAG" />
              </label>
            </Panel>
          </section>

          <section className="guide-section" aria-labelledby="tabs-title">
            <Panel>
              <p className="eyebrow">Navegación interna</p>
              <h2 id="tabs-title">Pestañas</h2>
              <Tabs items={["Vista general", "Detalle"]} active={activeGuideTab} onChange={setActiveGuideTab} />
              <p className="guide-copy">Pestaña activa: {activeGuideTab}</p>
            </Panel>
          </section>

          <section className="guide-section" aria-labelledby="empty-state-title">
            <h2 id="empty-state-title">Estado vacío</h2>
            <EmptyState
              eyebrow="Sin datos todavía"
              title="Sin evaluaciones para comparar"
              titleLevel={3}
              description="Completá un bloque válido para habilitar este espacio."
              action={<Button href="#/evaluacion/nueva">Crear evaluación</Button>}
            />
          </section>
        </div>
      </div>
    </AppShell>
  );
}
