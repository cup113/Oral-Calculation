import { defineQuestionModule } from './index';

type Params = { digits1: number; digits2: number };

export default defineQuestionModule<Params>({
  id: 'mul',
  paramsConfig: [
    { key: 'digits1', name: "运算项 #1 位数", type: 'integer', min: 1, default: 2 },
    { key: 'digits2', name: "运算项 #2 位数", type: 'integer', min: 1, default: 1 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, Question } = context;
    let digits1 = params.digits1, digits2 = params.digits2;
    if (digits1 < digits2)
      [digits1, digits2] = [digits2, digits1];
    const
      num1 = rand_digit_big_int(digits1, { avoidIsOne: true, avoidEndsWithZero: true }),
      num2 = rand_digit_big_int(digits2, { avoidIsOne: true, avoidEndsWithZero: true }),
      correctAnswer = num1.multiply(num2);
    const problem = `${num1.toString()} × ${num2.toString()} = ?`;
    return new Question(problem, correctAnswer.toString());
  },
  get_title(params) {
    return `${params.digits1}位数乘${params.digits2}位数`;
  },
});
