import { defineQuestionModule } from './index';

type Params = { maxCoefficientDigits: number };

export default defineQuestionModule<Params>({
  id: 'disc-2',
  paramsConfig: [
    { key: 'maxCoefficientDigits', name: "系数最大位数", type: 'integer', min: 1, default: 1 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, rand_sign, rand_between, Question, bigInt } = context;
    const
      a = rand_digit_big_int(rand_between(1, params.maxCoefficientDigits, 1)),
      b = rand_sign(rand_digit_big_int(params.maxCoefficientDigits)),
      c = rand_sign(rand_digit_big_int(rand_between(1, params.maxCoefficientDigits, 1))),
      bDisplay = b.isPositive() ? `+ ${b.toString()}` : `- ${b.abs().toString()}`,
      cDisplay = c.isPositive() ? `+ ${c.toString()}` : `- ${c.abs().toString()}`,
      problem = `${a.toString()}x² ${bDisplay}x ${cDisplay} = 0, Δ = ?`,
      correctAnswer = b.square().minus(a.multiply(c).multiply(bigInt[4]));
    return new Question(problem, correctAnswer.toString());
  },
  get_title(params) {
    return `系数最高为${params.maxCoefficientDigits}位数的一元二次方程根的判别式`;
  },
});
