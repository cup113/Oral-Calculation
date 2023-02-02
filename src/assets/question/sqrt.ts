import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

const enum IsPerfectSquare {
  Always = 0,
  NoAndFloor = 1,
}

class SqrtQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  public isPerfectSquare: IsPerfectSquare;

  constructor(dep: Dependency, params: string[]) {
    this.dep = dep;
    this.digits = parseInt(params[0]);
    this.isPerfectSquare = parseInt(params[1]) as IsPerfectSquare;
  }

  public get_question(): Question {
    const { rand_digit_big_int, rand_between_big_int, minmax_big_int, Question, bigInt } = this.dep;
    const [minNum, maxNum] = minmax_big_int(this.digits);
    while (true) {
      const correctAnswer = rand_digit_big_int(Math.floor((this.digits + 1) / 2), { avoidEndsWithZero: true });
      let num = correctAnswer.square();
      let problem: string;
      switch (this.isPerfectSquare) {
        case IsPerfectSquare.Always:
          problem = `√(${num})`;
          break;
        case IsPerfectSquare.NoAndFloor:
          let remainder = rand_between_big_int(bigInt[0], correctAnswer.multiply(2).minus(1));
          num = num.add(remainder);
          problem = `⌊√(${num})⌋`;
          break;
      }
      if (num.lt(minNum) || num.gt(maxNum))
        continue;
      problem += ` = ?`;
      return new Question(problem, correctAnswer.toString());
    }
  }

  public get_title(): string {
    return `${this.digits}位数开平方`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string[]): SqrtQuestionProvider {
    return new SqrtQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "被开方数位数",
      min: 1,
      default: 3,
    },
    {
      type: 'select',
      name: "保证完全平方数",
      choices: ["保证", "不保证，答案向下取整"],
      default: 0,
    }
  ],
} satisfies QuestionModule;
