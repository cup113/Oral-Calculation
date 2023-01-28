import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class AddSubQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  constructor(dep: Dependency, params: string) {
    const paramArr = params.split(",");
    this.dep = dep;
    this.digits = parseInt(paramArr[0]);
    throw Error("#TODO");
  }

  public get_question(): Question {
    const { rand_big_int, bigInt, Question } = this.dep;
    throw Error("#TODO");
  }

  public get_title(): string {
    return `${this.digits}位数加减混合运算`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string): AddSubQuestionProvider {
    return new AddSubQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      name: "位数",
      min: 1,
    },
    {
      name: "运算项个数",
      min: 2,
    }
  ],
} as QuestionModule;

