import bigInt from 'big-integer';
import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class PowQuestionProvider implements QuestionProvider {
  private readonly dep: Dependency;
  public resultMaxDigits: number;
  public maxExponent: number;

  constructor(dep: Dependency, params: string[]) {
    this.dep = dep;
    this.resultMaxDigits = parseInt(params[0]);
    this.maxExponent = parseInt(params[1]);
  }

  public get_question(): Question {
    const { Question, minmax_big_int } = this.dep;
    // TODO it may cause loop
    while (true) {
      let
        exponent = bigInt.randBetween(2, this.maxExponent),
        base = bigInt.randBetween(2, minmax_big_int(Math.floor(this.resultMaxDigits / 2))[0]),
        answer = base.pow(exponent);
      if (answer.toString().length > this.resultMaxDigits)
        continue;
      let
        problem = `${base.toString()} ^ ${exponent.toString()} = ?`,
        correctAnswer = answer.toString();
      return new Question(problem, correctAnswer);
    }
  }

  public get_title(): string {
    return `结果最高为${this.resultMaxDigits}位数的幂运算`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string[]): PowQuestionProvider {
    return new PowQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "结果最大位数",
      min: 2,
      default: 4,
    },
    {
      type: 'integer', // TODO range
      name: '最大指数',
      min: 2,
      default: 2,
    }
  ],
} satisfies QuestionModule;