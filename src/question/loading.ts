import { defineQuestionModule } from './index';

type Params = Record<string, never>;

export default defineQuestionModule<Params>({
  id: 'loading',
  paramsConfig: [],
  generate(context) {
    return new context.Question("Loading...", "");
  },
  get_title() {
    return "ERROR";
  },
});
