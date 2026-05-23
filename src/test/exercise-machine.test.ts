import { describe, it, expect } from 'vitest';
import {
  ExerciseStatus,
  canStart,
  canSubmitAnswer,
  shouldWarnLoading,
  shouldSkipToNext,
  shouldStartFromSubmit,
  getStatusOnModuleLoad,
  getStatusOnStart,
  getStatusOnCorrectAnswer,
} from '@/exercise/exercise-machine';

describe("exercise-machine", () => {
  describe("canStart", () => {
    it("returns true for Loaded", () => {
      expect(canStart(ExerciseStatus.Loaded)).toBe(true);
    });
    it("returns true for Ready", () => {
      expect(canStart(ExerciseStatus.Ready)).toBe(true);
    });
    it("returns false for Loading", () => {
      expect(canStart(ExerciseStatus.Loading)).toBe(false);
    });
    it("returns false for Answering", () => {
      expect(canStart(ExerciseStatus.Answering)).toBe(false);
    });
    it("returns false for Ended", () => {
      expect(canStart(ExerciseStatus.Ended)).toBe(false);
    });
  });

  describe("canSubmitAnswer", () => {
    it("returns true for Answering", () => {
      expect(canSubmitAnswer(ExerciseStatus.Answering)).toBe(true);
    });
    it("returns false for other statuses", () => {
      expect(canSubmitAnswer(ExerciseStatus.Loading)).toBe(false);
      expect(canSubmitAnswer(ExerciseStatus.Loaded)).toBe(false);
      expect(canSubmitAnswer(ExerciseStatus.Ready)).toBe(false);
      expect(canSubmitAnswer(ExerciseStatus.Ended)).toBe(false);
    });
  });

  describe("shouldWarnLoading", () => {
    it("returns true for Loading", () => {
      expect(shouldWarnLoading(ExerciseStatus.Loading)).toBe(true);
    });
    it("returns false for other statuses", () => {
      expect(shouldWarnLoading(ExerciseStatus.Loaded)).toBe(false);
      expect(shouldWarnLoading(ExerciseStatus.Ready)).toBe(false);
    });
  });

  describe("shouldSkipToNext", () => {
    it("returns true for Ready", () => {
      expect(shouldSkipToNext(ExerciseStatus.Ready)).toBe(true);
    });
    it("returns false for other statuses", () => {
      expect(shouldSkipToNext(ExerciseStatus.Loading)).toBe(false);
      expect(shouldSkipToNext(ExerciseStatus.Loaded)).toBe(false);
    });
  });

  describe("shouldStartFromSubmit", () => {
    it("returns true for Loaded", () => {
      expect(shouldStartFromSubmit(ExerciseStatus.Loaded)).toBe(true);
    });
    it("returns false for other statuses", () => {
      expect(shouldStartFromSubmit(ExerciseStatus.Loading)).toBe(false);
      expect(shouldStartFromSubmit(ExerciseStatus.Ready)).toBe(false);
    });
  });

  describe("getStatusOnModuleLoad", () => {
    it("returns Loaded when validation passes", () => {
      expect(getStatusOnModuleLoad("")).toBe(ExerciseStatus.Loaded);
    });
    it("returns 'exit' when validation fails", () => {
      expect(getStatusOnModuleLoad("参数错误")).toBe('exit');
    });
  });

  describe("getStatusOnStart", () => {
    it("returns Ready when loaded", () => {
      expect(getStatusOnStart(true)).toBe(ExerciseStatus.Ready);
    });
    it("returns null when not loaded", () => {
      expect(getStatusOnStart(false)).toBeNull();
    });
  });

  describe("getStatusOnCorrectAnswer", () => {
    it("returns Ended when isLastQuestion is true", () => {
      expect(getStatusOnCorrectAnswer(true)).toBe(ExerciseStatus.Ended);
    });
    it("returns Ready when isLastQuestion is false", () => {
      expect(getStatusOnCorrectAnswer(false)).toBe(ExerciseStatus.Ready);
    });
  });
});
