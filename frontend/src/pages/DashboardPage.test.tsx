import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("dashboard", () => {
  it("shows the demo identity, core metrics, and evaluation action", () => {
    render(<DashboardPage />);
    expect(screen.getAllByText(/TP Salchipapa/)).toHaveLength(2);
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar evaluación" })).toHaveAttribute("href", "#/evaluacion/nueva");
  });

  it("labels displayed information as demo data", () => {
    render(<DashboardPage />);
    expect(screen.getAllByText("Datos demostrativos")).toHaveLength(2);
  });

  it("keeps the demo profile and Riot disclaimer in the mobile shell", () => {
    const { container } = render(<DashboardPage />);
    const mobileShell = container.querySelector(".app-mobile-nav");
    const disclosure = mobileShell?.querySelector(".app-mobile-disclosure");

    expect(disclosure).toBeInTheDocument();
    const mobileDisclosure = within(disclosure as HTMLElement);
    expect(mobileDisclosure.getByText("TP Salchipapa #3192")).toBeInTheDocument();
    expect(mobileDisclosure.getByText("LAS · Diamante IV")).toBeInTheDocument();
    expect(mobileDisclosure.getByText("Datos demostrativos")).toBeInTheDocument();
    expect(mobileDisclosure.getByText("TopCoach LoL no está respaldado por Riot Games y no refleja sus opiniones.")).toBeInTheDocument();
  });
});
