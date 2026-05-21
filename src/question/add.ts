import { defineQuestionModule } from './index';

type Params = { digits: number };

export default defineQuestionModule<Params>({
  id: 'add',
  paramsConfig: [
    { key: 'digits', name: "位数", type: 'integer', min: 1, default: 3 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, Question } = context;
    const
      num1 = rand_digit_big_int(params.digits),
      num2 = rand_digit_big_int(params.digits),
      correctAnswer = num1.add(num2).toString(),
      problem = `${num1.toString()} + ${num2.toString()} = ?`;
    return new Question(problem, correctAnswer);
  },
  get_title(params) {
    return `${params.digits}位数加${params.digits}位数`;
  },
});
