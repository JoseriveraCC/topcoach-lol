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
    const averageKda = demoMatches.reduce(
      (total, match) => total + (match.kills + match.assists) / match.deaths,
      0,
    ) / demoMatches.length;
    const averageCs = demoMatches.reduce((total, match) => total + match.csPerMinute, 0) / demoMatches.length;
    const csVariance = demoMatches.reduce(
      (total, match) => total + (match.csPerMinute - averageCs) ** 2,
      0,
    ) / demoMatches.length;
    const csCoefficientOfVariation = (Math.sqrt(csVariance) / averageCs) * 100;
    const earlyDeathPriority = demoEvaluation.priorities.find((priority) => priority.id === "early-deaths");
    const farmPriority = demoEvaluation.priorities.find((priority) => priority.id === "farm-consistency");

    expect(demoEvaluation.winRate).toBe((wins / demoMatches.length) * 100);
    expect(demoEvaluation.averageKda).toBe(Number(averageKda.toFixed(1)));
    expect(demoEvaluation.csPerMinute).toBe(Number(averageCs.toFixed(1)));
    expect(earlyDeathPriority?.observedValue).toBe(`${(earlyDeaths / demoMatches.length).toFixed(1)} por partida`);
    expect(farmPriority?.observedValue).toBe(`${averageCs.toFixed(1)} CS/min; CV ${csCoefficientOfVariation.toFixed(1)}%`);
    expect(farmPriority?.reference).toBe("CV ≤ 6%");
  });
});
