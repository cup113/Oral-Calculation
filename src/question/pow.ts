import { defineQuestionModule } from './index';

type Params = { resultMaxDigits: number; maxExponent: number };

export default defineQuestionModule<Params>({
  id: 'pow',
  paramsConfig: [
    { key: 'resultMaxDigits', name: "结果最大位数", type: 'integer', min: 2, max: 12, default: 4 },
    { key: 'maxExponent', name: '最大指数', type: 'integer', min: 2, max: 60, default: 2 },
  ],
  generate(context, params) {
    const { Question, minmax_big_int, rand_between, rand_between_big_int, bigInt } = context;
    while (true) {
      let
        exponent = rand_between(2, params.maxExponent),
        maxBase = minmax_big_int(Math.floor((params.resultMaxDigits + 1) / 2))[1],
        base = rand_between_big_int(bigInt[2], maxBase),
        answer = base.pow(exponent);
      if (answer.toString().length > params.resultMaxDigits)
        continue;
      let
        problem = `${base.toString()} ^ ${exponent.toString()} = ?`,
        correctAnswer = answer.toString();
      return new Question(problem, correctAnswer);
    }
  },
  get_title(params) {
    return `结果最高为${params.resultMaxDigits}位数的幂运算`;
  },
});
