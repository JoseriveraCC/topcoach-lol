import type { ReactNode } from "react";
import { demoUser } from "../data/demo";
import { routeHref, type Route } from "../lib/router";
import { Brand, StatusBadge } from "./ui";

const navigation = [
  ["Resumen", "/dashboard"],
  ["Evaluación actual", "/evaluacion/4"],
  ["Plan de práctica", "/plan"],
  ["Historial", "/historial"],
  ["Guía visual", "/guia-visual"],
] satisfies ReadonlyArray<readonly [string, Route]>;

function NavigationLinks({ activeRoute }: { activeRoute: Route }) {
  return navigation.map(([label, route]) => (
    <a
      key={route}
      className="nav-link"
      href={routeHref(route)}
      aria-current={route === activeRoute ? "page" : undefined}
    >
      {label}
    </a>
  ));
}

export function AppShell({ children, activeRoute }: { children: ReactNode; activeRoute: Route }) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Brand />
        <nav className="nav-list" aria-label="Navegación principal">
          <NavigationLinks activeRoute={activeRoute} />
        </nav>
        <div className="app-profile">
          <StatusBadge tone="neutral">Datos demostrativos</StatusBadge>
          <strong aria-label={`${demoUser.summonerName} #${demoUser.tagLine}`}>
            {demoUser.summonerName.split(" ").map((namePart) => <span key={namePart} aria-hidden="true">{namePart} </span>)}
            <span aria-hidden="true">#{demoUser.tagLine}</span>
          </strong>
          <span>{demoUser.region} · {demoUser.rank}</span>
        </div>
        <p className="app-disclaimer">TopCoach LoL no está respaldado por Riot Games y no refleja sus opiniones.</p>
      </aside>

      <div className="app-main">
        <header className="app-mobile-nav">
          <div className="app-mobile-nav__top">
            <Brand />
          </div>
          <div className="app-mobile-disclosure">
            <div className="app-mobile-profile">
              <StatusBadge tone="neutral">Datos demostrativos</StatusBadge>
              <strong>{demoUser.summonerName} #{demoUser.tagLine}</strong>
              <span>{demoUser.region} · {demoUser.rank}</span>
            </div>
            <p>TopCoach LoL no está respaldado por Riot Games y no refleja sus opiniones.</p>
          </div>
          <nav className="app-mobile-nav__links" aria-label="Navegación principal móvil">
            <NavigationLinks activeRoute={activeRoute} />
          </nav>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
