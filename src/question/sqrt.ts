import { defineQuestionModule } from './index';

type Params = { digits: number; isPerfectSquare: number };

const enum IsPerfectSquare {
  Always = 0,
  NoAndFloor = 1,
}

export default defineQuestionModule<Params>({
  id: 'sqrt',
  paramsConfig: [
    { key: 'digits', name: "被开方数位数", type: 'integer', min: 1, default: 3 },
    { key: 'isPerfectSquare', name: "保证完全平方数", type: 'select', choices: ["保证", "不保证，答案向下取整"], default: 0 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, rand_between_big_int, minmax_big_int, Question, bigInt } = context;
    const [minNum, maxNum] = minmax_big_int(params.digits);
    while (true) {
      const correctAnswer = rand_digit_big_int(Math.floor((params.digits + 1) / 2), { avoidEndsWithZero: true });
      let num = correctAnswer.square();
      let problem = "";
      switch (params.isPerfectSquare) {
        case IsPerfectSquare.Always:
          problem = `√(${num})`;
          break;
        case IsPerfectSquare.NoAndFloor:
          let remainder = rand_between_big_int(bigInt[0], correctAnswer.multiply(2).minus(1));
          num = num.add(remainder);
          problem = `⌊√(${num})⌋`;
          break;
      }
      if (num.lt(minNum) || num.gt(maxNum))
        continue;
      problem += ` = ?`;
      return new Question(problem, correctAnswer.toString());
    }
  },
  get_title(params) {
    return `${params.digits}位数开平方`;
  },
});
