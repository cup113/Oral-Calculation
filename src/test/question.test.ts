import { describe, it, expect, assert } from 'vitest';

import * as question from '@/assets/question';
import loading from '@/assets/question/loading';
import add from '@/assets/question/add';
import sub from '@/assets/question/sub';
import add_sub from '@/assets/question/add-sub';
import mul from '@/assets/question/mul';
import div from '@/assets/question/div';
import pow from '@/assets/question/pow';
import pff from '@/assets/question/pff';
import disc2 from '@/assets/question/disc-2';
import sqrt from '@/assets/question/sqrt';

const { QUESTION_CONTEXT: context } = question;
const { bigInt } = context;

function expect_in_range_bigint(num: bigInt.BigInteger, l: bigInt.BigInteger, r: bigInt.BigInteger) {
  assert(num.geq(l), `${num} is not greater than ${l}`);
  assert(num.leq(r), `${num} is not less than ${l}`);
}

function expect_in_range(num: number, l: number, r: number) {
  expect(num).greaterThanOrEqual(l).lessThanOrEqual(r);
}

describe("question-util", () => {
  const { CATEGORIES, CategoryId, get_module } = question;
  const {
    sqrt_big_int,
    minmax_big_int,
    rand_digit_big_int,
    rand_between,
    rand_between_big_int,
    empty_array,
    rand_sign,
    Fraction,
  } = context;

  it("categories-module", () => {
    const ids = [
      CategoryId.Null,
      CategoryId.Add,
      CategoryId.Sub,
      CategoryId.AddSub,
      CategoryId.Mul,
      CategoryId.Div,
      CategoryId.Pow,
      CategoryId.Pff,
      CategoryId.Disc2,
      CategoryId.Sqrt,
    ];
    for (let i in ids) {
      expect(ids[i]).toEqual(CATEGORIES[i].id);
      expect(get_module(ids[i])).resolves.toBeTypeOf('object');
    }
  });

  it("minmax-big-int", () => {
    let l = bigInt[1], r = bigInt[9];
    for (let i = 1; i < 1000; ++i) {
      let [minBigInt, maxBigInt] = minmax_big_int(i);
      assert(l.eq(minBigInt));
      assert(r.eq(maxBigInt));
      l = l.multiply(10);
      r = r.multiply(10).add(9);
    }
  });

  it("rand-digit-big-int", () => {
    for (let i = 1; i < 1000; ++i) {
      let num = rand_digit_big_int(i);
      expect_in_range_bigint(num, ...minmax_big_int(i))
    }
    for (let i = 0; i < 100; ++i) {
      let num = rand_digit_big_int(1, { avoidIsOne: true });
      assert(num.neq(1));
    }
    for (let i = 1; i < 100; ++i) {
      let num = rand_digit_big_int(i, { avoidEndsWithZero: true });
      expect(num.mod(10).isZero()).toBeFalsy();
    }
  });

  it("rand-between", () => {
    // ! This test may fail for a very small probability.
    let acc;

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10);
      expect_in_range(num, 1, 10);
      acc += num;
    }
    expect_in_range(acc, 3000, 7000);

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10, 8);
      expect_in_range(num, 1, 10);
      acc += num;
    }
    expect_in_range(acc, 8000, 9800);

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10, -8);
      expect_in_range(num, 1, 10);
      acc += num;
    }
    expect_in_range(acc, 1200, 3000);
  });

  it("rand-between-big-int", () => {
    // ! This test may fail for a very small probability.
    const L = bigInt("100010001000"), R = bigInt("100020001000");
    let acc: bigInt.BigInteger;

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R);
      expect_in_range_bigint(num, L, R);
      acc = acc.add(num);
    }
    expect_in_range_bigint(
      acc,
      L.multiply(700).add(R.multiply(300)),
      L.multiply(300).add(R.multiply(700))
    );

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R, 10);
      expect_in_range_bigint(num, L, R);
      acc = acc.add(num);
    }
    expect_in_range_bigint(
      acc,
      L.multiply(250).add(R.multiply(750)),
      L.multiply(20).add(R.multiply(980))
    );

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R, -10);
      expect_in_range_bigint(num, L, R);
      acc = acc.add(num);
    }
    expect_in_range_bigint(
      acc,
      L.multiply(980).add(R.multiply(20)),
      L.multiply(750).add(R.multiply(250))
    );
  });

  it("rand-sign", () => {
    // ! This test may fail for a very small probability.
    let changed = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_digit_big_int(30);
      let rand_signed = rand_sign(num);
      assert(num.abs().eq(rand_signed.abs()));
      changed += num.eq(rand_signed) ? 1 : 0;
    }
    expect_in_range(changed, 300, 700);
  });

  it("sqrt-big-int", () => {
    let num = bigInt[0];
    for (let i = 0; i < 100; ++i) {
      for (let j = 0; j < i * 2 + 1; ++j) {
        let [a, b] = sqrt_big_int(num);
        assert(a.eq(i));
        assert(b.eq(j));
        num = num.add(1);
      }
    }
  });

  it("empty-array", () => {
    expect(empty_array(100).length).toBe(100);
    assert(empty_array(100).every(value => value === 0));
  });

  it("fraction", () => {
    for (let i = 1; i < 200; ++i) {
      for (let j = 1; j < 200; ++j) {
        let fraction = new Fraction(bigInt(i), bigInt(j));
        let value1 = fraction.numerator.multiply(100).divide(fraction.denominator);
        expect(fraction.toString()).toBe(`${i}/${j}`);
        let value2 = fraction.numerator.multiply(100).divide(fraction.denominator);
        fraction.reduce();
        assert(value1.eq(value2));
        assert(bigInt.gcd(fraction.numerator, fraction.denominator).eq(1));
      }
    }
  });
});

describe("question-class", () => {
  it("question", () => {
    const { AnswerResult } = question;
    const { Question } = context;
    expect(Question.new_loaded().problem.length).toBeGreaterThan(0);
    expect(Question.new_loaded().correctAnswer.length).toBe(0);
    const q1 = new Question("3/2", "1..1");
    expect(q1.correctAnswer).toBe("1..1");
    expect(q1.end.getTime()).toBe(q1.start.getTime());
    expect(q1.get_duration()).toBe(q1.end.getTime() - q1.start.getTime());
    assert(!q1.passed);
    expect(q1.wrongAnswers.size).toBe(0);
    expect(q1.try_answer("1")).toBe(AnswerResult.WrongNew);
    expect(q1.try_answer("")).toBe(AnswerResult.WrongEmpty);
    expect(q1.try_answer("2")).toBe(AnswerResult.WrongNew);
    expect(q1.try_answer("1")).toBe(AnswerResult.WrongAnswered);
    setTimeout(() => {
      expect(q1.get_elapsed()).toBeGreaterThan(0);
      expect(q1.try_answer("1..1")).toBe(AnswerResult.Correct);
      assert(!q1.is_first_time_correct());
    }, 4);
    setTimeout(() => {
      expect(q1.get_duration()).toBeGreaterThan(0);
    }, 8);
    const q2 = new Question("p", "a");
    setTimeout(() => {
      expect(q2.try_answer("a")).toBe(AnswerResult.Correct);
      assert(q2.is_first_time_correct());
      expect(q2.get_duration()).toBeGreaterThan(0);
    }, 4);
  });
});

describe("question-provider", () => {
  it("loading", () => {
    const { get_provider, paramsConfig } = loading;
    expect(paramsConfig.length).toBe(0);
    const provider = get_provider(context, []);
    const question = provider.get_question();
    expect(provider.get_title()).toBe("ERROR");
    expect(question.problem.length).toBeGreaterThan(0);
    expect(question.correctAnswer.length).toBe(0);
  });

  it("add", () => {
    const { get_provider, paramsConfig } = add;
    expect(paramsConfig.length).toBe(1);
    for (let i = 1; i < 10; ++i) {
      let provider = get_provider(context, [i.toString()]);
      expect(provider.digits).toBe(i);
      expect(provider.get_title()).contain(i.toString()).contain("加");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\+\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.add(num2);
        expect(num1.toString().length).toBe(i);
        expect(num2.toString().length).toBe(i);
        expect(question.correctAnswer).toBe(answer.toString());
      }
    }
  });

  it("sub", () => {
    const { get_provider, paramsConfig } = sub;
    expect(paramsConfig.length).toBe(2);
    for (let i = 1; i < 10; ++i) {
      let allowNegative = i % 2 === 0;
      let provider = get_provider(context, [i.toString(), allowNegative ? '1' : '0']);
      expect(provider.digits).toBe(i);
      expect(provider.allowNegative).toBe(allowNegative);
      expect(provider.get_title()).contain(i.toString()).contain("减");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\-\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.subtract(num2);
        expect(num1.toString().length).toBe(i);
        expect(num2.toString().length).toBe(i);
        expect(question.correctAnswer).toBe(answer.toString());
        if (!allowNegative)
          assert(!num1.isNegative());
      }
    }
  });

  it("add-sub", () => {
    const { get_provider, paramsConfig } = add_sub;
    expect(paramsConfig.length).toBe(4);
    for (let i = 1; i < 200; ++i) {
      let
        digits = Math.floor(i / 10) + 1,
        items = i % 10 + 3,
        mixedSetting = i % 3,
        allowNegative = (i % 7) % 2 === 0 ? 1 : 0;
      let provider = get_provider(context, [digits.toString(), items.toString(), mixedSetting.toString(), allowNegative.toString()]);
      expect(provider.digits).toBe(digits);
      expect(provider.items).toBe(items);
      expect(provider.mixedSetting).toBe(mixedSetting);
      expect(provider.allowNegative).toBe(allowNegative === 1);
      expect(provider.get_title())
        .contain(digits.toString())
        .contain(provider.mixedSetting === 2 ? "连加连减" : "加减混合");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = [...question.problem.matchAll(/\d+|\+|\-/g)];
        let
          lastSign = '+',
          answer = bigInt(problem[0][0]);
        for (let k = 1; k < problem.length; ++k) {
          switch (problem[k][0][0]) {
            case '+': case '-':
              lastSign = problem[k][0];
              break;
            default:
              expect(problem[k][0].length).toBe(digits);
              answer = lastSign === '+' ? answer.add(bigInt(problem[k][0])) : answer.subtract(problem[k][0]);
              break;
          }
        }
        expect(question.correctAnswer).toBe(answer.toString());
      }
    }
  });

  it("mul", () => {
    const { get_provider, paramsConfig } = mul;
    expect(paramsConfig.length).toBe(2);
    for (let i = 1; i < 50; ++i) {
      let digits1 = Math.floor(i / 7) + 1, digits2 = i % 7 + 1;
      let provider = get_provider(context, [digits1.toString(), digits2.toString()]);
      expect(provider.digits1 + provider.digits2).toBe(digits1 + digits2);
      expect(provider.get_title())
        .contain(digits1.toString())
        .contain(digits2.toString())
        .contain("乘");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s×\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.multiply(num2);
        expect(num1.toString().length + num2.toString().length).toBe(digits1 + digits2);
        expect(question.correctAnswer).toBe(answer.toString());
      }
    }
  });

  it("div", () => {
    const { get_provider, paramsConfig } = div;
    expect(paramsConfig.length).toBe(4);
    for (let i = 1; i < 200; ++i) {
      let
        digits1 = Math.floor(i / 10) + 1,
        digits2 = i % 10 + 1,
        divisible = i % 3,
        indivisibleSetting = (i % 7) % 2 === 0 ? 1 : 0;
      if (digits1 < digits2)
        continue;
      let provider = get_provider(context, [digits1.toString(), digits2.toString(), divisible.toString(), indivisibleSetting.toString()]);
      expect(provider.digits1).toBe(digits1);
      expect(provider.digits2).toBe(digits2);
      expect(provider.divisible).toBe(divisible);
      expect(provider.indivisibleSetting).toBe(indivisibleSetting);
      expect(provider.get_title())
        .contain(digits1.toString())
        .contain(digits2.toString())
        .contain("除以")
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s÷\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]);
        if (provider.divisible === 0) {
          assert(num1.isDivisibleBy(num2));
          assert(num2.multiply(bigInt(question.correctAnswer)).eq(num1));
        } else {
          if (question.correctAnswer.includes("...")) {
            let [quotient, remainder] = question.correctAnswer.split("...").map(value => bigInt(value));
            assert(remainder.isPositive() && !remainder.isZero());
            assert(quotient.multiply(num2).add(remainder).eq(num1));
          } else if (question.correctAnswer.includes("/")) {
            let [numerator, denominator] = question.correctAnswer.split("/").map(value => bigInt(value));
            assert(denominator.multiply(num1).eq(numerator.multiply(num2)));
            assert(bigInt.gcd(denominator, numerator).eq(1));
          } else {
            assert(bigInt(question.correctAnswer).multiply(num2).eq(num1));
          }
        }
      }
    }
  });

  it("pow", () => {
    const { get_provider, paramsConfig } = pow;
    expect(paramsConfig.length).toBe(2);
    for (let i = 2; i < 10; ++i) {
      let provider = get_provider(context, [i.toString(), (Math.floor(i / 2) + 1).toString()]);
      expect(provider.get_title()).contain(i.toString()).contain("幂运算");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\^\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.pow(num2);
        expect(answer.toString().length).toBeLessThanOrEqual(i);
        assert(num1.neq(1));
        expect(question.correctAnswer).toBe(answer.toString());
      }
    }
  });

  it("pff", () => {
    const { get_provider, paramsConfig } = pff;
    expect(paramsConfig.length).toBe(1);
    for (let i = 1; i < 11; ++i) {
      let provider = get_provider(context, [i.toString()]);
      expect(provider.get_title()).contain(i.toString()).contain("质因数分解");
      for (let j = i === 10 ? 90 : 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s/.exec(question.problem);
        assert(problem !== null);
        let
          num = bigInt(problem[1]),
          correctAnswer = question.correctAnswer;
        expect(num.toString().length).toBe(i);
        assert(correctAnswer.split(",").every(value => bigInt(value).isPrime()));
        assert(correctAnswer.split(",").map(value => bigInt(value)).reduce(
          (pre, cur) => pre.multiply(cur), bigInt[1]
        ).eq(num));
      }
    }
  });

  it("disc-2", () => {
    const { get_provider, paramsConfig } = disc2;
    expect(paramsConfig.length).toBe(1);
    for (let i = 1; i < 10; ++i) {
      let provider = get_provider(context, [i.toString()]);
      expect(provider.get_title()).contain(i.toString()).contain("根的判别式");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)x²\s([+-])\s(\d+)x\s([+-])\s(\d+)\s=/.exec(question.problem);
        assert(problem !== null);
        let
          a = bigInt(problem[1]),
          b = bigInt(problem[2] + problem[3]),
          c = bigInt(problem[4] + problem[5]),
          answer = b.square().minus(a.multiply(c).multiply(4)).toString(),
          correctAnswer = question.correctAnswer;
        expect(b.abs().toString().length).toBe(i);
        expect(a.toString().length).toBeLessThanOrEqual(i);
        expect(c.abs().toString().length).toBeLessThanOrEqual(i);
        expect(correctAnswer).toBe(answer);
      }
    }
  });

  it("sqrt", () => {
    const { sqrt_big_int } = context;
    const { get_provider, paramsConfig } = sqrt;
    expect(paramsConfig.length).toBe(2);
    for (let i = 2; i < 21; ++i) {
      let
        digits = Math.floor(i / 2),
        isPerfectSquare = i % 2; // Always=0, NoAndFloor=1
      let provider = get_provider(context, [digits.toString(), isPerfectSquare.toString()]);
      expect(provider.get_title()).contain(digits.toString()).contain("开平方");
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(⌊)?√\((\d+)\)/.exec(question.problem);
        assert(problem !== null);
        let
          floored = problem[1] !== undefined,
          num = bigInt(problem[2]),
          [answer, remainder] = sqrt_big_int(num),
          correctAnswer = question.correctAnswer;
        expect(num.toString().length).toBe(digits);
        expect(correctAnswer).toBe(answer.toString());
        if (!floored)
          assert(remainder.isZero());
      }
    }
  });
});
