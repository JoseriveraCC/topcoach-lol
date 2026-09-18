import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

function visit(hash: string) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

beforeEach(() => { window.location.hash = "#/"; });

describe("prototype routes", () => {
  const cases = [
    ["#/", /Jugá con intención/i],
    ["#/login", /Volvé a tu entrenamiento/i],
    ["#/registro", /Creá tu cuenta/i],
    ["#/recuperar", /Restablecer contraseña/i],
    ["#/vincular", /Vinculá tu Riot ID/i],
    ["#/dashboard", /Tu entrenamiento, en contexto/i],
    ["#/evaluacion/nueva", /Nueva evaluación/i],
    ["#/evaluacion/4", /Tu siguiente mejora empieza acá/i],
    ["#/plan", /Plan de 3 partidas/i],
    ["#/historial", /Historial de evaluaciones/i],
    ["#/guia-visual", /Sistema visual/i],
  ] as const;

  it.each(cases)("renders %s", (hash, heading) => {
    window.location.hash = hash;
    render(<App />);
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("reacts to hash navigation without remounting", () => {
    render(<App />);
    visit("#/dashboard");
    expect(screen.getByRole("heading", { name: /Tu entrenamiento, en contexto/i })).toBeInTheDocument();
    visit("#/evaluacion/4");
    expect(screen.getByRole("heading", { name: /Tu siguiente mejora empieza acá/i })).toBeInTheDocument();
  });

  it("falls back to the landing page for unknown hashes", () => {
    window.location.hash = "#/desconocida";
    render(<App />);
    expect(screen.getByRole("heading", { name: /Jugá con intención/i })).toBeInTheDocument();
  });

  it("completes the primary click journey", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("link", { name: "Crear cuenta gratis" }));
    expect(window.location.hash).toBe("#/registro");
    expect(await screen.findByRole("heading", { name: "Creá tu cuenta" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Correo electrónico"), "demo@topcoach.test");
    await user.type(screen.getByLabelText("Contraseña"), "demo-segura");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(window.location.hash).toBe("#/vincular");
    expect(await screen.findByRole("heading", { name: "Vinculá tu Riot ID" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Riot ID"), "TP Salchipapa");
    await user.type(screen.getByLabelText("Tag"), "3192");
    await user.click(screen.getByRole("button", { name: "Vincular cuenta demo" }));
    expect(window.location.hash).toBe("#/dashboard");
    expect(await screen.findByRole("heading", { name: "Tu entrenamiento, en contexto" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Solicitar evaluación" }));
    expect(window.location.hash).toBe("#/evaluacion/nueva");
    expect(await screen.findByRole("heading", { name: "Nueva evaluación" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Simular 10 partidas" }));
    await user.click(screen.getByRole("button", { name: "Generar evaluación demo" }));
    await user.click(screen.getByRole("button", { name: "Completar análisis" }));
    await user.click(screen.getByRole("link", { name: "Abrir informe" }));
    expect(window.location.hash).toBe("#/evaluacion/4");
    expect(await screen.findByRole("heading", { name: "Tu siguiente mejora empieza acá" })).toBeInTheDocument();

    await user.click(screen.getAllByRole("link", { name: "Plan de práctica" })[0]);
    expect(window.location.hash).toBe("#/plan");
    expect(await screen.findByRole("heading", { name: "Plan de 3 partidas" })).toBeInTheDocument();
  });
});
