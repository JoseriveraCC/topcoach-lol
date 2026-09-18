import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthPage } from "./AuthPage";
import { LandingPage } from "./LandingPage";
import { LinkAccountPage } from "./LinkAccountPage";

beforeEach(() => { window.location.hash = "#/"; });

describe("public journey", () => {
  it("offers both account actions on the landing page", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: "Crear cuenta gratis" })).toHaveAttribute("href", "#/registro");
    expect(screen.getByRole("link", { name: "Iniciar sesión" })).toHaveAttribute("href", "#/login");
  });

  it("advances registration after valid demo fields", async () => {
    render(<AuthPage mode="register" />);
    await userEvent.type(screen.getByLabelText("Correo electrónico"), "demo@topcoach.test");
    await userEvent.type(screen.getByLabelText("Contraseña"), "demo-segura");
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(window.location.hash).toBe("#/vincular");
  });

  it("keeps registration in context when required fields are empty", async () => {
    render(<AuthPage mode="register" />);
    await userEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(window.location.hash).toBe("#/");
  });

  it("links a demo Riot ID and advances", async () => {
    render(<LinkAccountPage />);
    await userEvent.type(screen.getByLabelText("Riot ID"), "TP Salchipapa");
    await userEvent.type(screen.getByLabelText("Tag"), "3192");
    await userEvent.click(screen.getByRole("button", { name: "Vincular cuenta demo" }));
    expect(window.location.hash).toBe("#/dashboard");
  });

  it("identifies the account-linking demo and defaults to LAS", () => {
    render(<LinkAccountPage />);
    expect(screen.getByText("Esta demo no consulta la API de Riot")).toBeInTheDocument();
    expect(screen.getByLabelText("Región")).toHaveValue("LAS");
  });

  it("keeps account linking in context when required fields are empty", async () => {
    render(<LinkAccountPage />);
    await userEvent.click(screen.getByRole("button", { name: "Vincular cuenta demo" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(window.location.hash).toBe("#/");
  });
});
