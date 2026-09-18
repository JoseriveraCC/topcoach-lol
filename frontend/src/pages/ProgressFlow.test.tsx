import { render, screen, within } from "@testing-library/react";
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

  it("publishes the complete visual contract with live components", async () => {
    const { container } = render(<StyleGuidePage />);
    const expectedTokens = [
      ["Vacío", "#050B0F", "Fondo principal"],
      ["Superficie", "#0D171D", "Tarjetas y navegación"],
      ["Superficie elevada", "#111D24", "Superficies elevadas"],
      ["Línea", "#23343C", "Bordes y divisores"],
      ["Texto", "#F2F7F8", "Texto principal"],
      ["Texto secundario", "#7F9DAB", "Texto secundario"],
      ["Acción", "#43D8CD", "Acciones, selección y progreso activo"],
      ["Acento", "#E7B761", "Rango, logros y énfasis competitivo"],
      ["Alerta", "#EF6156", "Alertas y métricas críticas"],
      ["Éxito", "#55D99B", "Éxito y estado completado"],
    ] as const;

    expectedTokens.forEach(([name, value, usage]) => {
      const swatch = screen.getByText(name, { selector: "strong" }).closest(".swatch");
      expect(swatch).toBeInTheDocument();
      expect(within(swatch as HTMLElement).getByText(value)).toBeInTheDocument();
      expect(within(swatch as HTMLElement).getByText(usage, { selector: "small" })).toBeInTheDocument();
    });
    ["Tokens de color", "Tipografía", "Botones", "Estados", "Métricas", "Superficies", "Pestañas", "Estado vacío"].forEach((name) => {
      expect(screen.getByRole("heading", { name, level: 2 })).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Sistema visual", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acción primaria" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Progreso de ejemplo" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Riot ID de ejemplo" })).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toHaveClass("status--neutral");
    expect(screen.getByText("En proceso")).toHaveClass("status--process");
    expect(screen.getByText("Neutral")).not.toHaveClass("status--process");
    expect(screen.getByRole("heading", { name: "Sin evaluaciones para comparar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Crear evaluación" })).toHaveAttribute("href", "#/evaluacion/nueva");
    expect(screen.getByText("Preparado para capturas 16:9")).toBeInTheDocument();
    expect(container.querySelector(".style-guide.capture-frame")).toBeInTheDocument();

    const detailTab = screen.getByRole("tab", { name: "Detalle" });
    await userEvent.click(detailTab);
    expect(detailTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pestaña activa: Detalle")).toBeInTheDocument();
  });
});
