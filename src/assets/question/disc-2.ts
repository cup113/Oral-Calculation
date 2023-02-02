import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class Disc2QuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public maxCoefficientDigits: number;

  constructor(dep: Dependency, params: string[]) {
    this.dep = dep;
    this.maxCoefficientDigits = parseInt(params[0]);
  }

  public get_question(): Question {
    const {rand_digit_big_int, rand_sign, rand_between, Question, bigInt} = this.dep;
    const
      a = rand_digit_big_int(rand_between(1, this.maxCoefficientDigits, 1)),
      b = rand_sign(rand_digit_big_int(this.maxCoefficientDigits)),
      c = rand_sign(rand_digit_big_int(rand_between(1, this.maxCoefficientDigits, 1))),
      bDisplay = b.isPositive() ? `+ ${b.toString()}` : `- ${b.abs().toString()}`,
      cDisplay = c.isPositive() ? `+ ${c.toString()}` : `- ${c.abs().toString()}`,
      problem = `${a.toString()}x² ${bDisplay}x ${cDisplay} = 0, Δ = ?`,
      correctAnswer = b.square().minus(a.multiply(c).multiply(bigInt[4]));
    return new Question(problem, correctAnswer.toString());
  }

  public get_title(): string {
    return `系数最高为${this.maxCoefficientDigits}位数的一元二次方程根的判别式`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string[]): Disc2QuestionProvider {
    return new Disc2QuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "系数最大位数",
      min: 1,
      default: 1,
    },
  ],
} satisfies QuestionModule;
