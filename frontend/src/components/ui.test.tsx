import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import "../styles.css";
import { Button, PageHeader, ProgressBar, Tabs } from "./ui";

describe("UI primitives", () => {
  it("renders route buttons as accessible links", () => {
    render(<Button href="#/dashboard">Ir al dashboard</Button>);
    expect(screen.getByRole("link", { name: "Ir al dashboard" })).toHaveAttribute("href", "#/dashboard");
  });

  it("forwards native anchor props on link buttons", async () => {
    const onClick = vi.fn();
    render(
      <>
        <p id="dashboard-context">Abre el resumen</p>
        <Button
          href="#/dashboard"
          target="_blank"
          rel="noreferrer"
          title="Abrir dashboard"
          aria-describedby="dashboard-context"
          onClick={onClick}
        >
          Ir al dashboard
        </Button>
      </>,
    );

    const link = screen.getByRole("link", { name: "Ir al dashboard" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("title", "Abrir dashboard");
    expect(link).toHaveAttribute("aria-describedby", "dashboard-context");

    await userEvent.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("labels numeric progress", () => {
    render(<ProgressBar value={7} max={10} label="Partidas válidas" />);
    expect(screen.getByRole("progressbar", { name: "Partidas válidas" })).toHaveAttribute("aria-valuenow", "7");
  });

  it("changes the selected tab through a button", async () => {
    const onChange = vi.fn();
    render(<Tabs items={["Resumen", "Evidencia"]} active="Resumen" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Evidencia" }));
    expect(onChange).toHaveBeenCalledWith("Evidencia");
  });

  it("does not submit an enclosing form when a tab is activated", async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Tabs items={["Resumen", "Evidencia"]} active="Resumen" onChange={onChange} />
      </form>,
    );

    const evidenceTab = screen.getByRole("tab", { name: "Evidencia" });
    expect(evidenceTab).toHaveAttribute("type", "button");

    await userEvent.click(evidenceTab);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("moves tab focus and selection with keyboard navigation", async () => {
    const onChange = vi.fn();
    render(<Tabs items={["Resumen", "Evidencia", "Límites"]} active="Resumen" onChange={onChange} />);

    const summaryTab = screen.getByRole("tab", { name: "Resumen" });
    const evidenceTab = screen.getByRole("tab", { name: "Evidencia" });
    const limitsTab = screen.getByRole("tab", { name: "Límites" });
    expect(summaryTab).toHaveAttribute("tabindex", "0");
    expect(evidenceTab).toHaveAttribute("tabindex", "-1");

    summaryTab.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(evidenceTab).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("Evidencia");

    await userEvent.keyboard("{End}");
    expect(limitsTab).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("Límites");

    await userEvent.keyboard("{ArrowRight}");
    expect(summaryTab).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith("Resumen");
  });

  it("uses only approved palette tokens for brand and panel surfaces", () => {
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules));
    const findRule = (selector: string) => rules.find((rule) => (rule as CSSStyleRule).selectorText === selector) as CSSStyleRule | undefined;
    const rootRule = findRule(":root");
    const brandRule = findRule(".brand");
    const panelRule = findRule(".panel");

    expect(rootRule?.style.getPropertyValue("--color-action-soft")).toBe("");
    expect(brandRule?.style.color).toBe("var(--color-action)");
    expect(panelRule?.style.background).toBe("linear-gradient(145deg, var(--color-surface-raised), var(--color-surface))");
  });

  it("keeps a visible focus indicator on clipped buttons", async () => {
    render(<Button>Continuar</Button>);

    await userEvent.tab();
    const button = screen.getByRole("button", { name: "Continuar" });
    const rules = Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules));
    const focusRule = rules.find((rule) => (rule as CSSStyleRule).selectorText === ".button--primary:focus-visible, .button--secondary:focus-visible") as CSSStyleRule | undefined;
    expect(button).toHaveFocus();
    expect(focusRule?.style.boxShadow).toContain("inset");
    expect(Number.parseFloat(focusRule?.style.outline ?? "")).toBe(0);
  });

  it("defines the reusable global layout conventions", () => {
    render(
      <>
        <div className="public-shell" data-testid="public-shell" />
        <div className="app-shell" data-testid="app-shell" />
        <div className="page-grid" data-testid="page-grid" />
        <div className="metric-grid" data-testid="metric-grid" />
        <PageHeader eyebrow="Evaluación" title="Resumen" description="Tu bloque actual" />
      </>,
    );

    expect(getComputedStyle(screen.getByTestId("public-shell")).minHeight).not.toBe("auto");
    expect(getComputedStyle(screen.getByTestId("app-shell")).minHeight).not.toBe("auto");
    expect(getComputedStyle(screen.getByTestId("page-grid")).display).toBe("grid");
    expect(getComputedStyle(screen.getByTestId("metric-grid")).display).toBe("grid");
    expect(getComputedStyle(screen.getByRole("banner")).display).toBe("flex");
  });
});
