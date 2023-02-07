import type { QuestionProvider, QuestionContext, Question, QuestionModule } from './index';

class AddQuestionProvider implements QuestionProvider {
  private context: QuestionContext;
  public digits: number;

  constructor(context: QuestionContext, params: string[]) {
    this.context = context;
    this.digits = parseInt(params[0]);
  }

  public get_question(): Question {
    const { rand_digit_big_int, Question } = this.context;
    const
      num1 = rand_digit_big_int(this.digits),
      num2 = rand_digit_big_int(this.digits),
      correctAnswer = num1.add(num2).toString(),
      problem = `${num1.toString()} + ${num2.toString()} = ?`;
    return new Question(problem, correctAnswer);
  }

  public get_title(): string {
    return `${this.digits}位数加${this.digits}位数`;
  }
}

export default {
  get_provider(context: QuestionContext, params: string[]): AddQuestionProvider {
    return new AddQuestionProvider(context, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      default: 3,
    },
  ],
  id: 'add'
} satisfies QuestionModule;
