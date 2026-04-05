/**
 * Lead Scoring Tests
 *
 * Option IDs match formData.ts exactly:
 *   Screen 1: '1a' = PI core, '1b' = PI secondary, '1c' = not PI
 *   Screen 2: '2a' = auto accidents core, '2b' = not major, '2c' = no
 *   Screen 3: multi-select states (array of state codes)
 *   Screen 4: multi-select metros (array of metro names)
 *   Screen 5: '5a' = yes consistently, '5b' = not always, '5c' = no
 *   Screen 6: '6a' = <5min, '6b' = 5-10min, '6c' = 11-30min, '6d' = >30min
 *   Screen 7: '7a' = dedicated in-house, '7b' = shared, '7c' = outsourced, '7d' = callback
 *   Screen 8: '8a' = 80-100%, '8b' = 60-79%, '8c' = 40-59%, '8d' = <40%
 *   Screen 9: '9a' = live after hours, '9b' = limited, '9c' = next biz day, '9d' = no
 *   Screen 10: '10a' = ready to pre-fund, '10b' = open to it, '10c' = no
 *   Screen 11: '11a' = immediately, '11b' = 3 days, '11c' = 7 days, '11d' = longer
 *   Screen 12: '12a' = 1-5, '12b' = 6-15, '12c' = 16-30, '12d' = 30+
 *   Screen 13: '13a' = direct approver, '13b' = partner, '13c' = not decision-maker
 */

import { describe, expect, it } from "vitest";
import { scoreApplication } from "./leadScoring";

describe("scoreApplication", () => {
  it("scores a platinum-tier application correctly", () => {
    // Screen 1: PI core (+20), Screen 2: auto accidents (+10), Screen 3: 5 states (+5),
    // Screen 4: 3 metros (+3), Screen 5: consistent 10-min (+12), Screen 6: <5min (+10),
    // Screen 7: dedicated intake (+8), Screen 8: 80-100% (+5), Screen 9: live after hours (+5),
    // Screen 10: ready to pre-fund (+15), Screen 11: immediately (+4), Screen 12: 30+ (+3),
    // Screen 13: direct approver (+1)
    // Total: 20+10+5+3+12+10+8+5+5+15+4+3+1 = 101 → score is 101, tier = platinum
    const answers: Record<string, string | string[]> = {
      1: "1a",
      2: "2a",
      3: ["CA", "TX", "FL", "NY", "IL"],
      4: ["Los Angeles", "New York City", "Chicago"],
      5: "5a",
      6: "6a",
      7: "7a",
      8: "8a",
      9: "9a",
      10: "10a",
      11: "11a",
      12: "12d",
      13: "13a",
    };
    const { score, tier } = scoreApplication(answers);
    expect(score).toBeGreaterThanOrEqual(75);
    expect(tier).toBe("platinum");
  });

  it("scores a gold-tier application correctly", () => {
    // Screen 1: PI core (+20), Screen 2: auto accidents (+10), Screen 3: 3 states (+4),
    // Screen 4: 1 metro (+2), Screen 5: not always (+5), Screen 6: 5-10min (+8),
    // Screen 7: shared intake (+6), Screen 8: 60-79% (+3), Screen 9: limited (+3),
    // Screen 10: open to pre-fund (+7), Screen 11: 3 days (+3), Screen 12: 16-30 (+3)
    // Total: 20+10+4+2+5+8+6+3+3+7+3+3 = 74 → gold
    const answers: Record<string, string | string[]> = {
      1: "1a",
      2: "2a",
      3: ["CA", "TX", "FL"],
      4: ["Los Angeles"],
      5: "5b",
      6: "6b",
      7: "7b",
      8: "8b",
      9: "9b",
      10: "10b",
      11: "11b",
      12: "12c",
    };
    const { score, tier } = scoreApplication(answers);
    expect(score).toBeGreaterThanOrEqual(55);
    expect(score).toBeLessThan(75);
    expect(tier).toBe("gold");
  });

  it("scores a silver-tier application correctly", () => {
    // Screen 1: PI secondary (+8), Screen 2: not major focus (+4), Screen 3: 1 state (+2),
    // Screen 4: default (+1), Screen 5: not always (+5), Screen 6: 11-30min (+4),
    // Screen 7: outsourced (+4), Screen 8: 40-59% (+2), Screen 9: next biz day (+1),
    // Screen 10: open to it (+7), Screen 11: 7 days (+2), Screen 12: 6-15 (+2)
    // Total: 8+4+2+1+5+4+4+2+1+7+2+2 = 42 → silver
    const answers: Record<string, string | string[]> = {
      1: "1b",
      2: "2b",
      3: ["CA"],
      5: "5b",
      6: "6c",
      7: "7c",
      8: "8c",
      9: "9c",
      10: "10b",
      11: "11c",
      12: "12b",
    };
    const { score, tier } = scoreApplication(answers);
    expect(score).toBeGreaterThanOrEqual(35);
    expect(score).toBeLessThan(55);
    expect(tier).toBe("silver");
  });

  it("disqualifies a non-PI firm", () => {
    // Screen 1: not PI (0), Screen 2: no auto accidents (0), Screen 10: no pre-fund (0)
    // Only metro coverage default (+1) and possibly nothing else
    // Total: 0+0+0+1 = 1 → disqualified
    const answers: Record<string, string | string[]> = {
      1: "1c",
      2: "2c",
      10: "10c",
    };
    const { tier } = scoreApplication(answers);
    expect(tier).toBe("disqualified");
  });

  it("handles empty answers gracefully without throwing", () => {
    expect(() => scoreApplication({})).not.toThrow();
    const { score, tier } = scoreApplication({});
    expect(score).toBeGreaterThanOrEqual(0);
    expect(["platinum", "gold", "silver", "disqualified"]).toContain(tier);
  });

  it("returns signals object with all expected keys", () => {
    const answers: Record<string, string | string[]> = {
      1: "1a",
      2: "2a",
      10: "10a",
    };
    const { signals } = scoreApplication(answers);
    expect(signals).toHaveProperty("practice_focus");
    expect(signals).toHaveProperty("case_mix");
    expect(signals).toHaveProperty("funding_model");
  });

  it("correctly scores a firm with no after-hours coverage as lower tier", () => {
    const answers: Record<string, string | string[]> = {
      1: "1a",
      2: "2a",
      9: "9d",  // no after-hours coverage
      10: "10a",
    };
    const { signals } = scoreApplication(answers);
    expect(signals["after_hours"]).toBe(0);
  });
});
