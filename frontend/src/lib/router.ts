import { useEffect, useState } from "react";

export const routes = [
  "/",
  "/login",
  "/registro",
  "/recuperar",
  "/vincular",
  "/dashboard",
  "/evaluacion/nueva",
  "/evaluacion/4",
  "/plan",
  "/historial",
  "/guia-visual",
] as const;

export type Route = (typeof routes)[number];

export function normalizeHash(hash: string): Route {
  const path = hash.replace(/^#/, "") || "/";
  return routes.includes(path as Route) ? (path as Route) : "/";
}

export function routeHref(route: Route): string {
  return `#${route}`;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => normalizeHash(window.location.hash));

  useEffect(() => {
    const updateRoute = () => setRoute(normalizeHash(window.location.hash));
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  return route;
}
