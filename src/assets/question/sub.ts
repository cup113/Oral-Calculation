import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class SubtractQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  constructor(dep: Dependency, params: string) {
    const paramArr = params.split(",");
    this.dep = dep;
    this.digits = parseInt(paramArr[0]);
  }

  public get_question(): Question {
    const { rand_big_int, bigInt, Question } = this.dep;
    while (true) {
      const
        num1 = rand_big_int(this.digits),
        num2 = rand_big_int(this.digits),
        correctAnswer = num1.add(num2);
      if (correctAnswer.leq(bigInt[0]))
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
  get_provider(bigIntModule: Dependency, params: string): SubtractQuestionProvider {
    return new SubtractQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      name: "位数",
      min: 1,
    },
  ],
} as QuestionModule;

