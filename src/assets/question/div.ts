import type { QuestionProvider, QuestionContext, Question, QuestionModule } from './index';

const enum IndivisibleSetting {
  Fraction = 0,
  QuoRem = 1,
}

const enum Divisible {
  Always = 0,
  Random = 1,
  Never = 2,
}

class DivideQuestionProvider implements QuestionProvider {
  private context: QuestionContext;
  public digits1: number;
  public digits2: number;
  public divisible: Divisible;
  public indivisibleSetting: IndivisibleSetting;

  constructor(context: QuestionContext, params: string[]) {
    this.context = context;
    this.digits1 = parseInt(params[0]);
    this.digits2 = parseInt(params[1]);
    this.divisible = parseInt(params[2]) as Divisible;
    this.indivisibleSetting = parseInt(params[3]) as IndivisibleSetting;
  }

  private get_question_divisible(): Question {
    const { minmax_big_int, rand_digit_big_int, bigInt, Question } = this.context;
    const [num1Min, num1Max] = minmax_big_int(this.digits1);
    const
      num2 = rand_digit_big_int(this.digits2, { avoidIsOne: true }),
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

  private get_question_indivisible(): Question {
    const { rand_digit_big_int, Question, Fraction } = this.context;
    while (true) {
      const
        num1 = rand_digit_big_int(this.digits1, { avoidIsOne: true }),
        num2 = rand_digit_big_int(this.digits2, { avoidIsOne: true }),
        question = `${num1.toString()} ÷ ${num2.toString()} = ?`;
      if (num1.isDivisibleBy(num2))
        continue;
      let correctAnswer: string;
      switch (this.indivisibleSetting) {
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

  public get_question(): Question {
    switch (this.divisible) {
      case Divisible.Always:
        return this.get_question_divisible();
      case Divisible.Random:
        return Math.random() < 0.5 ?
          this.get_question_divisible() :
          this.get_question_indivisible();
      case Divisible.Never:
        return this.get_question_indivisible();
    }
  }

  public get_title(): string {
    return `${this.digits1}位数除以${this.digits2}位数`;
  }
}

export default {
  get_provider(context: QuestionContext, params: string[]): DivideQuestionProvider {
    return new DivideQuestionProvider(context, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "运算项 #1 位数",
      min: 1,
      default: 3,
    },
    {
      type: 'integer',
      name: "运算项 #2 位数",
      min: 1,
      default: 2,
    },
    {
      type: 'select',
      name: "保证除尽",
      choices: ["保证", "随机决定", "不保证"],
      default: 0,
    },
    {
      type: 'select',
      name: "除不尽的答案表示",
      choices: ["分数(a/b)", "商和余数(a...b)"],
      default: 0,
    }
  ],
  validate(params): string {
    if (parseInt(params[2]) !== 2 && parseInt(params[0]) < parseInt(params[1]))
      return `在“${this.paramsConfig[2].name}”不为“不保证”时，“${this.paramsConfig[0].name}”不应小于“${this.paramsConfig[1].name}”。`;
    return "";
  },
  id: 'div',
} satisfies QuestionModule;
