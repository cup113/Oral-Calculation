import { suite, test, assert } from 'vitest';

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

const { DEP } = question;
const { bigInt } = DEP;

suite("question-util", () => {
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
  } = DEP;

  test("categories-module", async () => {
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
      assert(ids[i] === CATEGORIES[i].id);
      assert(await get_module(ids[i]));
    }
  });

  test("minmax-big-int", () => {
    let l = bigInt[1], r = bigInt[9];
    for (let i = 1; i < 1000; ++i) {
      let [minBigInt, maxBigInt] = minmax_big_int(i);
      assert(l.eq(minBigInt) && r.eq(maxBigInt));
      l = l.multiply(10);
      r = r.multiply(10).add(9);
    }
  });

  test("rand-digit-big-int", () => {
    for (let i = 1; i < 1000; ++i) {
      let num = rand_digit_big_int(i);
      assert(num.geq(minmax_big_int(i)[0]) && num.leq(minmax_big_int(i)[1]));
    }
    for (let i = 0; i < 100; ++i) {
      let num = rand_digit_big_int(1, { avoidIsOne: true });
      assert(num.neq(1));
    }
    for (let i = 1; i < 100; ++i) {
      let num = rand_digit_big_int(i, { avoidEndsWithZero: true });
      assert(!num.mod(10).isZero())
    }
  });

  test("rand-between", () => {
    // ! This test may fail for a very small probability.
    let acc;

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10);
      assert(num >= 1);
      assert(num <= 10);
      acc += num;
    }
    assert(acc > 3000 && acc < 7000, `acc=${acc}`);

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10, 8);
      assert(num >= 1);
      assert(num <= 10);
      acc += num;
    }
    assert(acc > 8000 && acc < 9800, `acc=${acc}`);

    acc = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between(1, 10, -8);
      assert(num >= 1);
      assert(num <= 10);
      acc += num;
    }
    assert(acc > 1200 && acc < 3000, `acc=${acc}`);
  });

  test("rand-between-big-int", () => {
    // ! This test may fail for a very small probability.
    const L = bigInt("100010001000"), R = bigInt("100020001000");
    let acc: bigInt.BigInteger;

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R);
      assert(num.geq(L));
      assert(num.leq(R));
      acc = acc.add(num);
    }
    assert(acc.gt(L.multiply(700).add(R.multiply(300))) && acc.lt(L.multiply(300).add(R.multiply(700))), `acc=${acc}`);

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R, 10);
      assert(num.geq(L));
      assert(num.leq(R));
      acc = acc.add(num);
    }
    assert(acc.gt(L.multiply(250).add(R.multiply(750))) && acc.lt(L.multiply(20).add(R.multiply(980))), `acc=${acc}`);

    acc = bigInt[0];
    for (let i = 0; i < 1000; ++i) {
      let num = rand_between_big_int(L, R, -10);
      assert(num.geq(L));
      assert(num.leq(R));
      acc = acc.add(num);
    }
    assert(acc.gt(L.multiply(980).add(R.multiply(20))) && acc.lt(L.multiply(750).add(R.multiply(250))), `acc=${acc}`);
  });

  test("rand-sign", () => {
    // ! This test may fail for a very small probability.
    let changed = 0;
    for (let i = 0; i < 1000; ++i) {
      let num = rand_digit_big_int(30);
      let rand_signed = rand_sign(num);
      assert(num.abs().eq(rand_signed.abs()));
      changed += num.eq(rand_signed) ? 1 : 0;
    }
    assert(changed > 300 && changed < 700);
  });

  test("sqrt-big-int", () => {
    let num = bigInt[0];
    for (let i = 0; i < 100; ++i) {
      for (let j = 0; j < i * 2 + 1; ++j) {
        let [a, b] = sqrt_big_int(num);
        assert(a.eq(i), `a=${a} b=${b} i=${i} num=${num}`);
        assert(b.eq(j), `a=${a} b=${b} j=${j} num=${num}`);
        num = num.add(1);
      }
    }
  });

  test("empty-array", () => {
    assert(empty_array(100).length === 100);
    assert(empty_array(100).every(value => value === 0));
  });

  test("fraction", () => {
    for (let i = 1; i < 200; ++i) {
      for (let j = 1; j < 200; ++j) {
        let fraction = new Fraction(bigInt(i), bigInt(j));
        let value1 = fraction.numerator.multiply(100).divide(fraction.denominator);
        assert(fraction.toString() === `${i}/${j}`);
        let value2 = fraction.numerator.multiply(100).divide(fraction.denominator);
        fraction.reduce();
        assert(value1.eq(value2));
        assert(bigInt.gcd(fraction.numerator, fraction.denominator).eq(1));
      }
    }
  });
});

suite("question-class", () => {
  test("question", () => {
    const { AnswerResult } = question;
    const { Question } = DEP;
    assert(Question.new_loaded().problem.length > 0);
    assert(Question.new_loaded().correctAnswer.length === 0);
    const q1 = new Question("3/2", "1..1");
    assert(q1.correctAnswer === "1..1");
    assert(q1.end.getTime() === q1.start.getTime());
    assert(q1.get_duration() === q1.end.getTime() - q1.start.getTime());
    assert(!q1.passed);
    assert(q1.wrongAnswers.size === 0);
    assert(q1.try_answer("1") === AnswerResult.WrongNew);
    assert(q1.try_answer("") === AnswerResult.WrongEmpty);
    assert(q1.try_answer("2") === AnswerResult.WrongNew);
    assert(q1.try_answer("1") === AnswerResult.WrongAnswered);
    setTimeout(() => {
      assert(q1.get_elapsed() > 0);
      assert(q1.try_answer("1..1") === AnswerResult.Correct);
      assert(!q1.is_first_time_correct());
    }, 4);
    setTimeout(() => {
      assert(q1.get_duration() > 0);
    }, 8);
    const q2 = new Question("p", "a");
    setTimeout(() => {
      assert(q2.try_answer("a") === AnswerResult.Correct);
      assert(q2.is_first_time_correct());
      assert(q2.get_duration() > 0);
    }, 4);
  });
});

suite("question-provider", () => {
  test("loading", () => {
    const { get_provider, paramsConfig } = loading;
    assert(paramsConfig.length === 0);
    const provider = get_provider(DEP, []);
    const question = provider.get_question();
    assert(provider.get_title() === "ERROR");
    assert(question.problem.length > 0);
    assert(question.correctAnswer.length === 0);
  });

  test("add", () => {
    const { get_provider, paramsConfig } = add;
    assert(paramsConfig.length === 1);
    for (let i = 1; i < 10; ++i) {
      let provider = get_provider(DEP, [i.toString()]);
      assert(provider.digits === i);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("加"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\+\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.add(num2);
        assert(num1.toString().length === i);
        assert(num2.toString().length === i);
        assert(question.correctAnswer === answer.toString());
      }
    }
  });

  test("sub", () => {
    const { get_provider, paramsConfig } = sub;
    assert(paramsConfig.length === 2);
    for (let i = 1; i < 10; ++i) {
      let allowNegative = i % 2 === 0;
      let provider = get_provider(DEP, [i.toString(), allowNegative ? '1' : '0']);
      assert(provider.digits === i);
      assert(provider.allowNegative === allowNegative);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("减"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\-\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.subtract(num2);
        assert(num1.toString().length === i);
        assert(num2.toString().length === i);
        assert(question.correctAnswer === answer.toString());
        if (!allowNegative)
          assert(!num1.isNegative());
      }
    }
  });

  test("add-sub", () => {
    const { get_provider, paramsConfig } = add_sub;
    assert(paramsConfig.length === 4);
    for (let i = 1; i < 200; ++i) {
      let
        digits = Math.floor(i / 10) + 1,
        items = i % 10 + 3,
        mixedSetting = i % 3,
        allowNegative = (i % 7) % 2 === 0 ? 1 : 0;
      let provider = get_provider(DEP, [digits.toString(), items.toString(), mixedSetting.toString(), allowNegative.toString()]);
      assert(provider.digits === digits);
      assert(provider.items === items);
      assert(provider.mixedSetting === mixedSetting);
      assert(provider.allowNegative === (allowNegative === 1));
      assert(provider.get_title().includes(digits.toString()));
      assert(provider.get_title().includes(provider.mixedSetting === 2 ? "连加连减" : "加减混合"));
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
              assert(problem[k][0].length === digits);
              answer = lastSign === '+' ? answer.add(bigInt(problem[k][0])) : answer.subtract(problem[k][0]);
              break;
          }
        }
        assert(question.correctAnswer === answer.toString());
      }
    }
  });

  test("mul", () => {
    const { get_provider, paramsConfig } = mul;
    assert(paramsConfig.length === 2);
    for (let i = 1; i < 50; ++i) {
      let digits1 = Math.floor(i / 7) + 1, digits2 = i % 7 + 1;
      let provider = get_provider(DEP, [digits1.toString(), digits2.toString()]);
      assert(provider.digits1 + provider.digits2 === digits1 + digits2);
      assert(provider.get_title().includes(digits1.toString()));
      assert(provider.get_title().includes(digits2.toString()));
      assert(provider.get_title().includes("乘"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s×\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.multiply(num2);
        assert(num1.toString().length + num2.toString().length === digits1 + digits2);
        assert(question.correctAnswer === answer.toString());
      }
    }
  });

  test("div", () => {
    const { get_provider, paramsConfig } = div;
    assert(paramsConfig.length === 4);
    for (let i = 1; i < 200; ++i) {
      let
        digits1 = Math.floor(i / 10) + 1,
        digits2 = i % 10 + 1,
        divisible = i % 3,
        indivisibleSetting = (i % 7) % 2 === 0 ? 1 : 0;
      if (digits1 < digits2)
        continue;
      let provider = get_provider(DEP, [digits1.toString(), digits2.toString(), divisible.toString(), indivisibleSetting.toString()]);
      assert(provider.digits1 === digits1);
      assert(provider.digits2 === digits2);
      assert(provider.divisible === divisible);
      assert(provider.indivisibleSetting === indivisibleSetting);
      assert(provider.get_title().includes(digits1.toString()));
      assert(provider.get_title().includes(digits2.toString()));
      assert(provider.get_title().includes("除以"));
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

  test("pow", () => {
    const { get_provider, paramsConfig } = pow;
    assert(paramsConfig.length === 2);
    for (let i = 2; i < 10; ++i) {
      let provider = get_provider(DEP, [i.toString(), (Math.floor(i / 2) + 1).toString()]);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("幂运算"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\^\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.pow(num2);
        assert(answer.toString().length <= i);
        assert(num1.neq(1));
        assert(question.correctAnswer === answer.toString());
      }
    }
  });

  test("pff", () => {
    const { get_provider, paramsConfig } = pff;
    assert(paramsConfig.length === 1);
    for (let i = 1; i < 11; ++i) {
      let provider = get_provider(DEP, [i.toString()]);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("质因数分解"));
      for (let j = i === 10 ? 90 : 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s/.exec(question.problem);
        assert(problem !== null);
        let
          num = bigInt(problem[1]),
          correctAnswer = question.correctAnswer;
        assert(num.toString().length === i);
        assert(correctAnswer.split(",").every(value => bigInt(value).isPrime()), `correctAnswer=${correctAnswer},problem=${problem}`);
        assert(correctAnswer.split(",").map(value => bigInt(value)).reduce(
          (pre, cur) => pre.multiply(cur), bigInt[1]
        ));
      }
    }
  });

  test("disc-2", () => {
    const { get_provider, paramsConfig } = disc2;
    assert(paramsConfig.length === 1);
    for (let i = 1; i < 10; ++i) {
      let provider = get_provider(DEP, [i.toString()]);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("根的判别式"));
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
        assert(b.abs().toString().length === i);
        assert(a.toString().length <= i);
        assert(c.abs().toString().length <= i);
        assert(correctAnswer === answer);
      }
    }
  });

  test("sqrt", () => {
    const { sqrt_big_int } = DEP;
    const { get_provider, paramsConfig } = sqrt;
    assert(paramsConfig.length === 2);
    for (let i = 2; i < 21; ++i) {
      let
        digits = Math.floor(i / 2),
        isPerfectSquare = i % 2; // Always=0, NoAndFloor=1
      let provider = get_provider(DEP, [digits.toString(), isPerfectSquare.toString()]);
      assert(provider.get_title().includes(digits.toString()));
      assert(provider.get_title().includes("开平方"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(⌊)?√\((\d+)\)/.exec(question.problem);
        assert(problem !== null);
        let
          floored = problem[1] !== undefined,
          num = bigInt(problem[2]),
          [answer, remainder] = sqrt_big_int(num),
          correctAnswer = question.correctAnswer;
        assert(num.toString().length === digits, `num=${num}, digits=${digits}`);
        assert(correctAnswer === answer.toString());
        if (!floored)
          assert(remainder.isZero());
      }
    }
  });
});
