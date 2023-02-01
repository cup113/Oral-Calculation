import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class MultiplyQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits1: number;
  public digits2: number;
  constructor(dep: Dependency, params: string) {
    const paramArr = params.split(",");
    this.dep = dep;
    this.digits1 = parseInt(paramArr[0]);
    this.digits2 = parseInt(paramArr[1]);

    if (this.digits1 < this.digits2)
      [this.digits1, this.digits2] = [this.digits2, this.digits1];
  }

  public get_question(): Question {
    const { rand_big_int, Question } = this.dep;
    const
      num1 = rand_big_int(this.digits1, { avoidIsOne: true, avoidEndsWithZero: true }),
      num2 = rand_big_int(this.digits2, { avoidIsOne: true, avoidEndsWithZero: true }),
      correctAnswer = num1.multiply(num2);
    const problem = `${num1.toString()} × ${num2.toString()} = ?`;
    return new Question(problem, correctAnswer.toString());
  }

  public get_title(): string {
    return `${this.digits1}位数乘${this.digits2}位数`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string): MultiplyQuestionProvider {
    return new MultiplyQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "运算项 #1 位数",
      min: 1,
      default: 2,
    },
    {
      type: 'integer',
      name: "运算项 #2 位数",
      min: 1,
      default: 1,
    }
  ],
} satisfies QuestionModule;

