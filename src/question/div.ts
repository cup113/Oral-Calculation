import { defineQuestionModule } from './index';

type Params = { digits1: number; digits2: number; divisible: number; indivisibleSetting: number };

const enum IndivisibleSetting {
  Fraction = 0,
  QuoRem = 1,
}

const enum Divisible {
  Always = 0,
  Random = 1,
  Never = 2,
}

function get_question_divisible(context: import('./index').QuestionContext, digits1: number, digits2: number) {
  const { minmax_big_int, rand_digit_big_int, bigInt, Question } = context;
  const [num1Min, num1Max] = minmax_big_int(digits1);
  const
    num2 = rand_digit_big_int(digits2, { avoidIsOne: true }),
    quotient = bigInt.randBetween(
      num1Min.add(num2.minus(1)).divide(num2),
      num1Max.divide(num2)
    ),
    num1 = num2.multiply(quotient);
  const
    problem = `${num1.toString()} ÷ ${num2.toString()} = ?`,
    correctAnswer = quotient.toString();
  return new Question(problem, correctAnswer);
}

function get_question_indivisible(
  context: import('./index').QuestionContext,
  digits1: number,
  digits2: number,
  indivisibleSetting: IndivisibleSetting
) {
  const { rand_digit_big_int, Question, Fraction } = context;
  while (true) {
    const
      num1 = rand_digit_big_int(digits1, { avoidIsOne: true }),
      num2 = rand_digit_big_int(digits2, { avoidIsOne: true }),
      question = `${num1.toString()} ÷ ${num2.toString()} = ?`;
    if (num1.isDivisibleBy(num2))
      continue;
    let correctAnswer: string;
    switch (indivisibleSetting) {
      case IndivisibleSetting.Fraction:
        let fraction = new Fraction(num1, num2);
        fraction.reduce();
        correctAnswer = fraction.toString();
        break;
      case IndivisibleSetting.QuoRem: {
        let { quotient, remainder } = num1.divmod(num2);
        correctAnswer = `${quotient.toString()}...${remainder.toString()}`;
        break;
      }
    }
    return new Question(question, correctAnswer);
  }
}

export default defineQuestionModule<Params>({
  id: 'div',
  paramsConfig: [
    { key: 'digits1', name: "运算项 #1 位数", type: 'integer', min: 1, default: 3 },
    { key: 'digits2', name: "运算项 #2 位数", type: 'integer', min: 1, default: 2 },
    { key: 'divisible', name: "保证除尽", type: 'select', choices: ["保证", "随机决定", "不保证"], default: 0 },
    { key: 'indivisibleSetting', name: "除不尽的答案表示", type: 'select', choices: ["分数(a/b)", "商和余数(a...b)"], default: 0 },
  ],
  generate(context, params) {
    switch (params.divisible as Divisible) {
      case Divisible.Always:
        return get_question_divisible(context, params.digits1, params.digits2);
      case Divisible.Random:
        return Math.random() < 0.5
          ? get_question_divisible(context, params.digits1, params.digits2)
          : get_question_indivisible(context, params.digits1, params.digits2, params.indivisibleSetting);
      case Divisible.Never:
        return get_question_indivisible(context, params.digits1, params.digits2, params.indivisibleSetting);
    }
  },
  get_title(params) {
    return `${params.digits1}位数除以${params.digits2}位数`;
  },
  validate(params) {
    if (params.divisible !== 2 && params.digits1 < params.digits2)
      return `在“保证除尽”不为“不保证”时，“运算项 #1 位数”不应小于“运算项 #2 位数”。`;
    return "";
  },
});
