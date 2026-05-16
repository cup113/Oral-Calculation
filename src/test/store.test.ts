// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

import useSettingStore from '@/store/setting';
import useMistakesStore from '@/store/mistakes';
import useQuestionStore from '@/store/question';

import { Question } from '@/question';

beforeEach(() => {
  localStorage.clear();
  setActivePinia(createPinia());
});

describe("store-setting", () => {
  it("defaults", () => {
    const store = useSettingStore();
    expect(store.categoryId).toBe("null");
    expect(store.quantity).toBe(10);
    expect(store.params).toEqual([]);
    expect(store.avoidRepeat).toBe(true);
    expect(store.darkMode).toBe(false);
  });

  describe("categoryIdManager", () => {
    it("get returns default", () => {
      const store = useSettingStore();
      expect(store.categoryIdManager.get()).toBe("null");
    });

    it("set validates and persists", () => {
      const store = useSettingStore();
      expect(store.categoryIdManager.set("add")).toBeTruthy();
      expect(store.categoryId).toBe("add");
      expect(localStorage.getItem("OC_CategoryId")).toBe("add");
    });

    it("set rejects invalid category", () => {
      const store = useSettingStore();
      expect(store.categoryIdManager.set("invalid")).toBeFalsy();
      expect(store.categoryId).toBe("null");
    });

    it("get reads from localStorage on fresh store", () => {
      localStorage.setItem("OC_CategoryId", "mul");
      const store = useSettingStore();
      expect(store.categoryId).toBe("mul");
    });

    it("validate checks against CATEGORIES", () => {
      const store = useSettingStore();
      expect(store.categoryIdManager.validate("add")).toBeTruthy();
      expect(store.categoryIdManager.validate("sqrt")).toBeTruthy();
      expect(store.categoryIdManager.validate("bogus")).toBeFalsy();
      expect(store.categoryIdManager.validate("null")).toBeTruthy();
    });
  });

  describe("quantityManager", () => {
    it("get returns default", () => {
      const store = useSettingStore();
      expect(store.quantityManager.get()).toBe(10);
    });

    it("set validates and persists", () => {
      const store = useSettingStore();
      expect(store.quantityManager.set("25")).toBeTruthy();
      expect(store.quantity).toBe(25);
      expect(localStorage.getItem("OC_Quantity")).toBe("25");
    });

    it("set rejects zero", () => {
      const store = useSettingStore();
      expect(store.quantityManager.set("0")).toBeFalsy();
      expect(store.quantity).toBe(10);
    });

    it("set rejects non-integer", () => {
      const store = useSettingStore();
      expect(store.quantityManager.set("abc")).toBeFalsy();
    });

    it("get reads from localStorage", () => {
      localStorage.setItem("OC_Quantity", "50");
      const store = useSettingStore();
      expect(store.quantity).toBe(50);
    });
  });

  describe("paramsManager", () => {
    it("get returns empty by default", () => {
      const store = useSettingStore();
      expect(store.paramsManager.get()).toEqual([]);
    });

    it("set persists per category", () => {
      const store = useSettingStore();
      store.paramsManager.set("3,1");
      expect(store.params).toEqual(["3", "1"]);
      expect(localStorage.getItem("OC_Params_null")).toBe("3,1");
    });

    it("set replaces previous params", () => {
      const store = useSettingStore();
      store.paramsManager.set("2,0");
      store.paramsManager.set("4");
      expect(store.params).toEqual(["4"]);
    });

    it("get reads from localStorage with correct prefix", () => {
      localStorage.setItem("OC_Params_add", "5");
      const store = useSettingStore();
      store.categoryIdManager.set("add");
      const result = store.paramsManager.get();
      expect(result).toEqual(["5"]);
    });

    it("filter_empty strips single empty string", () => {
      const store = useSettingStore();
      localStorage.setItem("OC_Params_null", "");
      expect(store.paramsManager.get()).toEqual([]);
    });
  });

  describe("avoidRepeatManager", () => {
    it("defaults to true", () => {
      const store = useSettingStore();
      expect(store.avoidRepeatManager.get()).toBe(true);
    });

    it("set persists false", () => {
      const store = useSettingStore();
      store.avoidRepeatManager.set("false");
      expect(store.avoidRepeat).toBe(false);
      expect(localStorage.getItem("OC_AvoidRepeat")).toBe("false");
    });
  });

  describe("darkModeManager", () => {
    it("defaults to false", () => {
      const store = useSettingStore();
      expect(store.darkModeManager.get()).toBe(false);
    });

    it("set persists true", () => {
      const store = useSettingStore();
      store.darkModeManager.set("true");
      expect(store.darkMode).toBe(true);
      expect(localStorage.getItem("OC_DarkMode")).toBe("true");
    });
  });
});

describe("store-mistakes", () => {
  it("get_mistakes returns empty initially", () => {
    const store = useMistakesStore();
    expect(store.get_mistakes()).toEqual([]);
  });

  it("append_mistake stores a question", () => {
    const store = useMistakesStore();
    const q = new Question("3+5", "8");
    store.append_mistake(q);
    const mistakes = store.get_mistakes();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0].problem).toBe("3+5");
    expect(mistakes[0].correctAnswer).toBe("8");
    expect(mistakes[0].wrongAnswers).toEqual([]);
  });

  it("append_mistake captures wrong answers", () => {
    const store = useMistakesStore();
    const q = new Question("2+2", "4");
    q.try_answer("5");
    q.try_answer("3");
    store.append_mistake(q);
    const mistakes = store.get_mistakes();
    expect(mistakes[0].wrongAnswers).toEqual(["5", "3"]);
  });

  it("bucket overflow creates new bucket at 50", () => {
    const store = useMistakesStore();
    for (let i = 0; i < 55; i++) {
      const q = new Question(`${i}`, `${i}`);
      store.append_mistake(q);
    }
    const mistakes = store.get_mistakes();
    expect(mistakes).toHaveLength(55);
  });

  it("clear_mistakes removes all entries", () => {
    const store = useMistakesStore();
    store.append_mistake(new Question("1", "1"));
    store.append_mistake(new Question("2", "2"));
    store.clear_mistakes();
    expect(store.get_mistakes()).toEqual([]);
  });
});

describe("store-question", () => {
  it("exposes overridable notify", () => {
    const store = useQuestionStore();
    expect(store.notify).toBeTypeOf("object");
    store.notify.success = vi.fn();
    store.notify.error = vi.fn();
    store.notify.warning = vi.fn();
  });

  it("sets start/end timestamps on update_question", () => {
    const setting = useSettingStore();
    setting.quantityManager.set("5");
    const store = useQuestionStore();
    store.reset_questions();
    store.update_question();
    expect(store.currentQuestion.start).toBeInstanceOf(Date);
    expect(store.currentQuestion.end).toBeInstanceOf(Date);
  });

  describe("reset_questions", () => {
    it("generates quantity questions", () => {
      const setting = useSettingStore();
      setting.quantityManager.set("5");
      const store = useQuestionStore();
      store.reset_questions();
      expect(store.questions).toHaveLength(5);
    });

    it("resets counters", () => {
      const store = useQuestionStore();
      store.passedCnt = 10;
      store.correctCnt = 8;
      store.wrongAnswerCnt = 3;
      store.reset_questions();
      expect(store.passedCnt).toBe(0);
      expect(store.correctCnt).toBe(0);
      expect(store.wrongAnswerCnt).toBe(0);
    });
  });

  describe("answer_current_question", () => {
    function setupWithQuestion(problem: string, correctAnswer: string) {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      store.questions.push(new Question(problem, correctAnswer));
      store.update_question();
      return store;
    }

    it("returns true and increments counters on correct answer", () => {
      const store = setupWithQuestion("2+2", "4");
      const result = store.answer_current_question("4");
      expect(result).toBe(true);
      expect(store.passedCnt).toBe(1);
      expect(store.correctCnt).toBe(1);
      expect(store.wrongAnswerCnt).toBe(0);
      expect(store.notify.success).toHaveBeenCalledWith("答案 4 正确");
    });

    it("returns false for empty answer", () => {
      const store = setupWithQuestion("2+2", "4");
      const result = store.answer_current_question("");
      expect(result).toBe(false);
      expect(store.passedCnt).toBe(0);
      expect(store.notify.warning).toHaveBeenCalledWith("答案不应为空");
    });

    it("returns false for new wrong answer", () => {
      const store = setupWithQuestion("2+2", "4");
      const result = store.answer_current_question("5");
      expect(result).toBe(false);
      expect(store.wrongAnswerCnt).toBe(1);
      expect(store.notify.error).toHaveBeenCalledWith("答案 5 错误");
    });

    it("returns false for repeated wrong answer", () => {
      const store = setupWithQuestion("2+2", "4");
      store.answer_current_question("5");
      vi.mocked(store.notify.error).mockClear();
      const result = store.answer_current_question("5");
      expect(result).toBe(false);
      expect(store.notify.error).toHaveBeenCalledWith("已经有过错误答案 5");
    });

    it("does not count as first-time-correct after wrong attempts", () => {
      const store = setupWithQuestion("2+2", "4");
      store.answer_current_question("5");
      store.answer_current_question("4");
      expect(store.correctCnt).toBe(0);
      expect(store.passedCnt).toBe(1);
    });

    it("appends to mistakes on non-first-time correct", () => {
      const mistakes = useMistakesStore();
      const store = setupWithQuestion("2+2", "4");
      store.answer_current_question("5");
      store.answer_current_question("4");
      expect(mistakes.get_mistakes()).toHaveLength(1);
      expect(mistakes.get_mistakes()[0].problem).toBe("2+2");
    });
  });

  describe("validate_params", () => {
    it("passes with matching params", () => {
      const store = useQuestionStore();
      expect(store.validate_params()).toBe("");
    });

    it("fails on length mismatch", () => {
      const setting = useSettingStore();
      setting.paramsManager.set("3,1");
      const store = useQuestionStore();
      const result = store.validate_params();
      expect(result).toContain("应有0个配置项");
      expect(result).toContain("2个");
    });
  });

  describe("timing-accumulation", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function push_q(store: ReturnType<typeof useQuestionStore>, problem: string, answer: string) {
      store.questions.push(new Question(problem, answer));
    }

    it("accumulatedDuration matches single correct question duration", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();
      vi.setSystemTime(2500);
      store.answer_current_question("2");

      expect(store.accumulatedDuration).toBe(1500);
    });

    it("each question duration is independent (not cumulative span)", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");
      push_q(store, "2+2", "4");

      vi.setSystemTime(1000);
      store.update_question();
      vi.setSystemTime(2000);
      store.answer_current_question("2");

      vi.setSystemTime(3000);
      store.update_question();
      vi.setSystemTime(3500);
      store.answer_current_question("4");

      // If wrongly cumulative (start=1000 to end=3500): accumulatedDuration=2500
      // Correct independent sum (1000 + 500): accumulatedDuration=1500
      expect(store.accumulatedDuration).toBe(1500);
    });

    it("update_question resets start and end timestamps", () => {
      const store = useQuestionStore();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();
      expect(store.currentQuestion.start.getTime()).toBe(1000);
      expect(store.currentQuestion.end.getTime()).toBe(1000);

      vi.setSystemTime(5000);
      store.update_question();
      expect(store.currentQuestion.start.getTime()).toBe(5000);
      expect(store.currentQuestion.end.getTime()).toBe(5000);
    });

    it("wrong answer updates accumulatedDuration and wrongAnswerCnt", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();

      vi.setSystemTime(2000);
      store.answer_current_question("3");

      // currentQuestionDuration (internal) is reflected in accumulatedDuration
      expect(store.accumulatedDuration).toBe(1000);
      expect(store.passedCnt).toBe(0);
      expect(store.wrongAnswerCnt).toBe(1);
    });

    it("wrong then correct: no double counting", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();

      vi.setSystemTime(1500);
      store.answer_current_question("3"); // WrongNew→accumulatedDuration=500 (elapsed)

      vi.setSystemTime(2500);
      store.answer_current_question("2"); // Correct→accumulatedDuration=1500 (end-start)

      // Full duration = 2500-1000 = 1500
      // If elapsed (500) were added separately: accumulatedDuration=2000
      // Correct: accumulatedDuration=1500
      expect(store.accumulatedDuration).toBe(1500);
      expect(store.passedCnt).toBe(1);
      expect(store.correctCnt).toBe(0); // Not first-time correct
      expect(store.wrongAnswerCnt).toBe(1);
    });

    it("multiple wrong answers: elapsed updates, final duration covers entire span", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();

      vi.setSystemTime(1200);
      store.answer_current_question("3");

      vi.setSystemTime(1500);
      store.answer_current_question("5");

      vi.setSystemTime(2500);
      store.answer_current_question("2");

      // Full duration from start (1000) to correct (2500) = 1500
      // Individual wrong timestamps not added separately
      expect(store.accumulatedDuration).toBe(1500);
    });

    it("all correct: accumulatedDuration equals sum of individual durations", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");
      push_q(store, "2+2", "4");
      push_q(store, "3+3", "6");

      vi.setSystemTime(1000); store.update_question();
      vi.setSystemTime(1500); store.answer_current_question("2"); // 500ms
      vi.setSystemTime(2000); store.update_question();
      vi.setSystemTime(3200); store.answer_current_question("4"); // 1200ms
      vi.setSystemTime(4000); store.update_question();
      vi.setSystemTime(4300); store.answer_current_question("6"); // 300ms

      expect(store.accumulatedDuration).toBe(2000); // 500 + 1200 + 300
      expect(store.correctCnt).toBe(3);
      expect(store.passedCnt).toBe(3);
      expect(store.wrongAnswerCnt).toBe(0);
    });

    it("empty answer does not affect passed count or wrong count", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();

      vi.setSystemTime(2000);
      store.answer_current_question("");
      expect(store.passedCnt).toBe(0);
      expect(store.wrongAnswerCnt).toBe(0);
      expect(store.accumulatedDuration).toBeGreaterThan(0);

      vi.setSystemTime(2500);
      store.answer_current_question("2");
      expect(store.accumulatedDuration).toBe(1500);
    });

    it("repeated wrong answer increments wrong count only once per distinct answer", () => {
      const store = useQuestionStore();
      store.notify.success = vi.fn();
      store.notify.error = vi.fn();
      store.notify.warning = vi.fn();
      push_q(store, "1+1", "2");

      vi.setSystemTime(1000);
      store.update_question();

      vi.setSystemTime(1200);
      store.answer_current_question("3");
      expect(store.wrongAnswerCnt).toBe(1);

      vi.setSystemTime(1500);
      store.answer_current_question("3"); // WrongAnswered, not counted
      expect(store.wrongAnswerCnt).toBe(1);

      vi.setSystemTime(2000);
      store.answer_current_question("5");
      expect(store.wrongAnswerCnt).toBe(2);

      vi.setSystemTime(3000);
      store.answer_current_question("2");
      expect(store.accumulatedDuration).toBe(2000); // 3000-1000
    });
  });
});
