import type { QuestionProvider, Question, QuestionModule, Dependency } from './index';

class LoadingQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  constructor(dep: Dependency, _params: string) {
    this.dep = dep;
  }

  public get_question(): Question {
    return new this.dep.Question("Loading...", "");
  }

  public get_title(): string {
    return "ERROR";
  }
}

export default {
  get_provider: function (bigInt: Dependency, params: string): LoadingQuestionProvider {
    return new LoadingQuestionProvider(bigInt, params)
  },
  paramsConfig: [],
} as QuestionModule;
