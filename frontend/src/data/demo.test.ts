import { describe, expect, it } from "vitest";
import { demoEvaluation, demoMatches } from "./demo";

describe("prototype demo data", () => {
  it("contains exactly ten valid evaluation matches", () => {
    expect(demoMatches).toHaveLength(10);
    expect(demoMatches.every((match) => match.queueId === 420 && match.role === "TOP")).toBe(true);
  });

  it("contains a three-match practice plan without enabling reevaluation", () => {
    expect(demoEvaluation.trainingGoals).toHaveLength(3);
    expect(demoEvaluation.newMatchesRequiredForReevaluation).toBe(10);
  });

  it("gives every priority observable evidence and a measurable goal", () => {
    expect(demoEvaluation.priorities.every((priority) =>
      priority.observedValue && priority.reference && priority.goal
    )).toBe(true);
  });

  it("keeps aggregate evaluation evidence consistent with the match block", () => {
    const wins = demoMatches.filter((match) => match.result === "Victoria").length;
    const earlyDeaths = demoMatches.reduce((total, match) => total + match.earlyDeaths, 0);
    const earlyDeathPriority = demoEvaluation.priorities.find((priority) => priority.id === "early-deaths");

    expect(demoEvaluation.winRate).toBe((wins / demoMatches.length) * 100);
    expect(earlyDeathPriority?.observedValue).toBe(`${(earlyDeaths / demoMatches.length).toFixed(1)} por partida`);
  });
});
