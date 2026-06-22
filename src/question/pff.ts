import { defineQuestionModule } from './index';

type Params = { digits: number };

function pff(num: bigInt.BigInteger, context: { bigInt: bigInt.BigIntegerStatic; sqrt_big_int: (num: bigInt.BigInteger) => [bigInt.BigInteger, bigInt.BigInteger] }): bigInt.BigInteger[] {
  const { bigInt, sqrt_big_int } = context;
  let divisor = bigInt[2], value = num;
  const [maxPossibleDivisor,] = sqrt_big_int(num);
  let ans: bigInt.BigInteger[] = [];
  while (divisor.lt(value) && divisor.leq(maxPossibleDivisor)) {
    if (value.isDivisibleBy(divisor)) {
      ans.push(divisor);
      value = value.divide(divisor);
    } else {
      divisor = divisor.add(1);
    }
  }
  ans.push(value);
  return ans;
}

export default defineQuestionModule<Params>({
  id: 'pff',
  paramsConfig: [
    { key: 'digits', name: "位数", type: 'integer', min: 1, max: 9, default: 3 },
  ],
  generate(context, params) {
    const { rand_digit_big_int, Question } = context;
    const
      num = rand_digit_big_int(params.digits, { avoidIsOne: true }),
      factors = pff(num, context),
      problem = num.toString().concat(" 的质因数有:"),
      correctAnswer = factors.map(factor => factor.toString()).join(",");
    return new Question(problem, correctAnswer);
  },
  get_title(params) {
    return `${params.digits}位数的质因数分解`;
  },
});
