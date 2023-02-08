import type { QuestionProvider, Question, QuestionModule, QuestionContext } from './index';

class LoadingQuestionProvider implements QuestionProvider {
  private context: QuestionContext;
  constructor(context: QuestionContext, _params: string[]) {
    this.context = context;
  }

  public get_question(): Question {
    return new this.context.Question("Loading...", "");
  }

  public get_title(): string {
    return "ERROR";
  }
}

export default {
  get_provider(context: QuestionContext, params: string[]): LoadingQuestionProvider {
    return new LoadingQuestionProvider(context, params)
  },
  paramsConfig: [],
  id: 'loading',
} satisfies QuestionModule;
