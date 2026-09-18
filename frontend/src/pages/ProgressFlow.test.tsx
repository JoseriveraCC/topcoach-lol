import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HistoryPage } from "./HistoryPage";
import { PlanPage } from "./PlanPage";
import { StyleGuidePage } from "./StyleGuidePage";

describe("progress journey", () => {
  it("tracks three practice matches locally", async () => {
    render(<PlanPage />);
    expect(screen.getByText("0/3 completadas")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /Partida 1/i }));
    expect(screen.getByText("1/3 completadas")).toBeInTheDocument();
    expect(screen.getByText(/10 partidas nuevas válidas/i)).toBeInTheDocument();
  });

  it("lists prior evaluations with only the included report linked", () => {
    render(<HistoryPage />);
    expect(screen.getAllByText("Completada")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Abrir evaluación 4" })).toHaveAttribute("href", "#/evaluacion/4");
    expect(screen.getAllByText("Detalle no incluido en la demo")).toHaveLength(2);
  });

  it("replaces history with its recoverable empty state", async () => {
    render(<HistoryPage />);

    await userEvent.click(screen.getByRole("button", { name: "Mostrar estado vacío" }));

    expect(screen.queryByText("Completada")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Todavía no hay evaluaciones" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear primera evaluación" })).toHaveAttribute("href", "#/evaluacion/nueva");
  });

  it("publishes presentation-ready color values and live components", () => {
    const { container } = render(<StyleGuidePage />);
    expect(screen.getByText("#43D8CD")).toBeInTheDocument();
    expect(screen.getByText("#E7B761")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sistema visual" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acción primaria" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Progreso de ejemplo" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Riot ID de ejemplo" })).toBeInTheDocument();
    expect(container.querySelector(".style-guide.capture-frame")).toBeInTheDocument();
  });
});
