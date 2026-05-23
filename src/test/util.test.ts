import { describe, it, expect } from 'vitest';
import {
  chunkArray,
  generatePrintId,
  formatProblems,
  formatAnswers,
  buildExerciseUrl,
  validatePositiveInteger,
} from '@/util';

describe("util - chunkArray", () => {
  it("splits array into chunks of given size", () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it("handles exact division", () => {
    expect(chunkArray([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });
  it("handles empty array", () => {
    expect(chunkArray([], 3)).toEqual([]);
  });
  it("handles chunk size larger than array", () => {
    expect(chunkArray([1, 2], 5)).toEqual([[1, 2]]);
  });
});

describe("util - generatePrintId", () => {
  it("generates 3 uppercase letters by default", () => {
    const id = generatePrintId();
    expect(id).toHaveLength(3);
    expect(/^[A-Z]{3}$/.test(id)).toBe(true);
  });
  it("generates custom length", () => {
    const id = generatePrintId(5);
    expect(id).toHaveLength(5);
    expect(/^[A-Z]+$/.test(id)).toBe(true);
  });
  it("generates different values each call", () => {
    const ids = new Set(Array.from({ length: 20 }, () => generatePrintId()));
    expect(ids.size).toBeGreaterThan(1);
  });
});

describe("util - formatProblems", () => {
  it("formats problems with blanks", () => {
    const qs = [{ problem: "3+5" }, { problem: "√(12)" }];
    const result = formatProblems(qs);
    expect(result).toEqual(["(1) 3+5__________", "(2) √(12)__________"]);
  });
  it("replaces ? with blank", () => {
    const qs = [{ problem: "×² ?" }];
    const result = formatProblems(qs);
    expect(result[0]).not.toContain("?");
    expect(result[0]).toContain("__________");
  });
  it("uses custom blank string", () => {
    const qs = [{ problem: "3+5" }];
    const result = formatProblems(qs, "____");
    expect(result[0]).toBe("(1) 3+5____");
  });
});

describe("util - formatAnswers", () => {
  it("formats answers with numbers", () => {
    const qs = [{ correctAnswer: "8" }, { correctAnswer: "12" }];
    expect(formatAnswers(qs)).toEqual(["(1) 8", "(2) 12"]);
  });
});

describe("util - buildExerciseUrl", () => {
  it("builds url with params", () => {
    expect(buildExerciseUrl("add", ["2", "1"], 10))
      .toBe("/exercise/add/2,1/10");
  });
  it("handles empty params", () => {
    expect(buildExerciseUrl("sqrt", [], 20))
      .toBe("/exercise/sqrt//20");
  });
});

describe("util - validatePositiveInteger", () => {
  it("returns number for valid input", () => {
    expect(validatePositiveInteger("5")).toBe(5);
    expect(validatePositiveInteger("1")).toBe(1);
    expect(validatePositiveInteger("100")).toBe(100);
  });
  it("returns null for zero", () => {
    expect(validatePositiveInteger("0")).toBeNull();
  });
  it("returns null for non-numeric", () => {
    expect(validatePositiveInteger("abc")).toBeNull();
    expect(validatePositiveInteger("")).toBeNull();
  });
  it("returns null for negative", () => {
    expect(validatePositiveInteger("-5")).toBeNull();
  });
});
