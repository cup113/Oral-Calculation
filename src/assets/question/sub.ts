import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class SubtractQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  public allowNegative: boolean;
  constructor(dep: Dependency, params: string[]) {
    this.dep = dep;
    this.digits = parseInt(params[0]);
    this.allowNegative = parseInt(params[1]) === 0 ? false : true;
  }

  public get_question(): Question {
    const { rand_digit_big_int, bigInt, Question } = this.dep;
    while (true) {
      const
        num1 = rand_digit_big_int(this.digits),
        num2 = rand_digit_big_int(this.digits),
        correctAnswer = num1.subtract(num2);
      if (!this.allowNegative && correctAnswer.leq(bigInt[0]))
        continue;
      const problem = `${num1.toString()} - ${num2.toString()} = ?`;
      return new Question(problem, correctAnswer.toString());
    }
  }

  public get_title(): string {
    return `${this.digits}位数减${this.digits}位数`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string[]): SubtractQuestionProvider {
    return new SubtractQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      default: 3,
    },
    {
      type: 'select',
      name: "允许结果为负数",
      choices: ["不允许", "允许"],
      default: 0,
    }
  ],
} satisfies QuestionModule;
