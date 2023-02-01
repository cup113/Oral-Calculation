import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class AddQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  constructor(dep: Dependency, params: string) {
    const paramArr = params.split(",");
    this.dep = dep;
    this.digits = parseInt(paramArr[0]);
  }

  public get_question(): Question {
    const rand_big_int = this.dep.rand_big_int;
    const
      num1 = rand_big_int(this.digits),
      num2 = rand_big_int(this.digits),
      correctAnswer = num1.add(num2).toString(),
      problem = `${num1.toString()} + ${num2.toString()} = ?`;
    return new this.dep.Question(problem, correctAnswer);
  }

  public get_title(): string {
    return `${this.digits}位数加${this.digits}位数`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string): AddQuestionProvider {
    return new AddQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      default: 3,
    },
  ],
} satisfies QuestionModule;

