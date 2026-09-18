import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardPage } from "./DashboardPage";

describe("dashboard", () => {
  it("shows the demo identity, core metrics, and evaluation action", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/TP Salchipapa/)).toBeInTheDocument();
    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("62%")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Solicitar evaluación" })).toHaveAttribute("href", "#/evaluacion/nueva");
  });

  it("labels displayed information as demo data", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Datos demostrativos")).toBeInTheDocument();
  });
});
