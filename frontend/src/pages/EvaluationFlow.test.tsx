import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EvaluationPage } from "./EvaluationPage";
import { ReportPage } from "./ReportPage";

describe("evaluation flow", () => {
  it("starts with seven of ten valid matches and can complete the demo", async () => {
    render(<EvaluationPage />);
    expect(screen.getByRole("progressbar", { name: "Partidas válidas" })).toHaveAttribute("aria-valuenow", "7");
    await userEvent.click(screen.getByRole("button", { name: "Simular 10 partidas" }));
    expect(screen.getByText("10 partidas listas para analizar")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Generar evaluación demo" }));
    await userEvent.click(screen.getByRole("button", { name: "Completar análisis" }));
    expect(screen.getByRole("link", { name: "Abrir informe" })).toHaveAttribute("href", "#/evaluacion/4");
  });

  it("switches report tabs and preserves the ten-match rule", async () => {
    render(<ReportPage />);
    expect(screen.getByText("10 partidas válidas")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Evidencia" }));
    expect(screen.getByRole("heading", { name: "Evidencia del bloque" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Plan de 3 partidas" }));
    expect(screen.getByText(/reevaluación requiere 10 partidas nuevas/i)).toBeInTheDocument();
  });

  it("shows a recoverable synchronization error without changing the validity rule", async () => {
    render(<EvaluationPage />);
    await userEvent.click(screen.getByRole("button", { name: "Simular error" }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Ranked Solo/Duo · Top Lane · queueId 420")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Reintentar sincronización" }));
    expect(screen.getByText("7 partidas válidas encontradas")).toBeInTheDocument();
  });

  it("exposes all ten evidence records and their visual values as text", async () => {
    render(<ReportPage />);
    await userEvent.click(screen.getByRole("tab", { name: "Evidencia" }));

    expect(screen.getAllByRole("listitem")).toHaveLength(10);
    expect(screen.getByLabelText("Partida 1: 0 muertes tempranas")).toBeInTheDocument();
    expect(screen.getByLabelText("Partida 10: 2 muertes tempranas")).toBeInTheDocument();
  });

  it("supports keyboard tab navigation in the report", async () => {
    const user = userEvent.setup();
    render(<ReportPage />);
    const summaryTab = screen.getByRole("tab", { name: "Resumen" });

    summaryTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Debilidades" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Debilidades" })).toHaveAttribute("aria-selected", "true");
  });
});
