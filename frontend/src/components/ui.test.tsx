import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, ProgressBar, Tabs } from "./ui";

describe("UI primitives", () => {
  it("renders route buttons as accessible links", () => {
    render(<Button href="#/dashboard">Ir al dashboard</Button>);
    expect(screen.getByRole("link", { name: "Ir al dashboard" })).toHaveAttribute("href", "#/dashboard");
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
});
