import { describe, expect, it } from "vitest";
import { normalizeHash, routeHref } from "./router";

describe("hash routing", () => {
  it("normalizes known hashes", () => {
    expect(normalizeHash("#/dashboard")).toBe("/dashboard");
    expect(normalizeHash("#/evaluacion/4")).toBe("/evaluacion/4");
  });

  it("falls back to the landing route", () => {
    expect(normalizeHash("#/ruta-inexistente")).toBe("/");
    expect(normalizeHash("")).toBe("/");
  });

  it("builds stable hash links", () => {
    expect(routeHref("/plan")).toBe("#/plan");
  });
});
