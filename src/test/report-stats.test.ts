import { describe, it, expect } from 'vitest';
import {
  computeCorrectRatio,
  formatPercentage,
  mapAndSortDurations,
  computeDurationPercentiles,
  createDurationDistribution,
  formatAverageDuration,
  formatDuration,
  formatResult,
  computeProgressColorIndex,
  computeDurationBarRatio,
} from '@/report/report-stats';

describe("report-stats", () => {
  describe("computeCorrectRatio", () => {
    it("computes ratio", () => {
      expect(computeCorrectRatio(6, 10)).toBe(0.6);
    });
    it("returns 0 for 0 correct", () => {
      expect(computeCorrectRatio(0, 10)).toBe(0);
    });
    it("returns 1 for all correct", () => {
      expect(computeCorrectRatio(10, 10)).toBe(1);
    });
  });

  describe("formatPercentage", () => {
    it("formats 0.6 as 60.0%", () => {
      expect(formatPercentage(0.6)).toBe("60.0%");
    });
    it("formats 0 as 0.0%", () => {
      expect(formatPercentage(0)).toBe("0.0%");
    });
    it("formats 1 as 100.0%", () => {
      expect(formatPercentage(1)).toBe("100.0%");
    });
    it("rounds 0.6666 to 66.7%", () => {
      expect(formatPercentage(0.6666)).toBe("66.7%");
    });
  });

  describe("mapAndSortDurations", () => {
    it("sorts durations ascending", () => {
      const qs = [
        { get_duration: () => 3000 },
        { get_duration: () => 1000 },
        { get_duration: () => 2000 },
      ];
      expect(mapAndSortDurations(qs)).toEqual([1000, 2000, 3000]);
    });
    it("handles empty array", () => {
      expect(mapAndSortDurations([])).toEqual([]);
    });
    it("handles single element", () => {
      expect(mapAndSortDurations([{ get_duration: () => 500 }])).toEqual([500]);
    });
  });

  describe("computeDurationPercentiles", () => {
    it("with 5+ items computes 20th and 80th percentiles", () => {
      const sorted = [100, 200, 300, 400, 500];
      const [fast, slow] = computeDurationPercentiles(sorted);
      expect(fast).toBe(100);  // oneFifth=1, index 0
      expect(slow).toBe(500);  // index length-1 = 4
    });
    it("with <5 items returns adjusted bounds", () => {
      const sorted = [100, 200, 300];
      const [fast, slow] = computeDurationPercentiles(sorted);
      expect(fast).toBe(99);   // 100 - 1
      expect(slow).toBe(301);  // 300 + 1
    });
  });

  describe("createDurationDistribution", () => {
    it("creates distribution object", () => {
      const sorted = [100, 300, 500];
      const dist = createDurationDistribution(sorted, 150, 450);
      expect(dist).toEqual({ min: 100, max: 500, fast: 150, slow: 450 });
    });
    it("freezes the object", () => {
      const dist = createDurationDistribution([1, 5], 1, 5);
      expect(Object.isFrozen(dist)).toBe(true);
    });
  });

  describe("formatAverageDuration", () => {
    it("formats as seconds with 3 decimals", () => {
      expect(formatAverageDuration(6000, 4)).toBe("1.500s");
    });
    it("handles zero ms", () => {
      expect(formatAverageDuration(0, 1)).toBe("0.000s");
    });
  });

  describe("formatDuration", () => {
    it("formats ms as seconds with 3 decimals", () => {
      expect(formatDuration(1234)).toBe("1.234s");
    });
    it("handles zero", () => {
      expect(formatDuration(0)).toBe("0.000s");
    });
  });

  describe("formatResult", () => {
    it("returns ✓ when correct", () => {
      expect(formatResult(true, 0)).toBe("✓");
    });
    it("returns count when wrong", () => {
      expect(formatResult(false, 2)).toBe("2");
    });
  });

  describe("computeProgressColorIndex", () => {
    it("returns 0 for fast", () => {
      expect(computeProgressColorIndex(true, true, false)).toBe(0);
      expect(computeProgressColorIndex(true, false, false)).toBe(0);
    });
    it("returns 1 for correct medium", () => {
      expect(computeProgressColorIndex(false, true, false)).toBe(1);
    });
    it("returns 2 for correct slow", () => {
      expect(computeProgressColorIndex(false, true, true)).toBe(2);
    });
    it("returns 3 for wrong", () => {
      expect(computeProgressColorIndex(false, false, false)).toBe(3);
      expect(computeProgressColorIndex(false, false, true)).toBe(3);
    });
  });

  describe("computeDurationBarRatio", () => {
    it("computes ratio between 0.4 and 0.8", () => {
      const ratio = computeDurationBarRatio(200, 100, 500);
      expect(ratio).toBeGreaterThanOrEqual(0.4);
      expect(ratio).toBeLessThanOrEqual(0.8);
    });
    it("fastest duration gives highest ratio", () => {
      const fast = computeDurationBarRatio(100, 100, 500);
      const slow = computeDurationBarRatio(500, 100, 500);
      expect(fast).toBeGreaterThan(slow);
    });
  });
});
