import { defineQuestionModule } from './index';

type Params = { digits: number; allowNegative: boolean };

export default defineQuestionModule<Params>({
  id: 'sub',
  paramsConfig: [
    { key: 'digits', name: "位数", type: 'integer', min: 1, default: 3 },
    { key: 'allowNegative', name: "允许结果为负数", type: 'boolean', default: 0 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, bigInt, Question } = context;
    while (true) {
      const
        num1 = rand_digit_big_int(params.digits),
        num2 = rand_digit_big_int(params.digits),
        correctAnswer = num1.subtract(num2);
      if (!params.allowNegative && correctAnswer.leq(bigInt[0]))
        continue;
      const problem = `${num1.toString()} - ${num2.toString()} = ?`;
      return new Question(problem, correctAnswer.toString());
    }
  },
  get_title(params) {
    return `${params.digits}位数减${params.digits}位数`;
  },
});
