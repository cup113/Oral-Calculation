import type { QuestionProvider, QuestionContext, Question, QuestionModule } from './index';

class MultiplyQuestionProvider implements QuestionProvider {
  private context: QuestionContext;
  public digits1: number;
  public digits2: number;
  constructor(context: QuestionContext, params: string[]) {
    this.context = context;
    this.digits1 = parseInt(params[0]);
    this.digits2 = parseInt(params[1]);

    if (this.digits1 < this.digits2)
      [this.digits1, this.digits2] = [this.digits2, this.digits1];
  }

  public get_question(): Question {
    const { rand_digit_big_int, Question } = this.context;
    const
      num1 = rand_digit_big_int(this.digits1, { avoidIsOne: true, avoidEndsWithZero: true }),
      num2 = rand_digit_big_int(this.digits2, { avoidIsOne: true, avoidEndsWithZero: true }),
      correctAnswer = num1.multiply(num2);
    const problem = `${num1.toString()} × ${num2.toString()} = ?`;
    return new Question(problem, correctAnswer.toString());
  }

  public get_title(): string {
    return `${this.digits1}位数乘${this.digits2}位数`;
  }
}

export default {
  get_provider(context: QuestionContext, params: string[]): MultiplyQuestionProvider {
    return new MultiplyQuestionProvider(context, params);
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
  id: 'mul',
} satisfies QuestionModule;
