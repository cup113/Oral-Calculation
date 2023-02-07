import type bigInt from 'big-integer';
import type { QuestionProvider, QuestionContext, Question, QuestionModule } from './index';

class PffQuestionProvider implements QuestionProvider {
  private context: QuestionContext;
  public digits: number;

  constructor(context: QuestionContext, params: string[]) {
    this.context = context;
    this.digits = parseInt(params[0]);
  }

  private pff(num: bigInt.BigInteger): bigInt.BigInteger[] {
    const { bigInt, sqrt_big_int } = this.context;
    let divisor = bigInt[2], value = num;
    const [maxPossibleDivisor,] = sqrt_big_int(num);
    let ans: bigInt.BigInteger[] = [];
    while (divisor.lt(value) && divisor.leq(maxPossibleDivisor)) {
      if (value.isDivisibleBy(divisor)) {
        ans.push(divisor);
        value = value.divide(divisor); // reference to owned
      } else {
        divisor = divisor.add(1);
      }
    }
    ans.push(value);
    return ans;
  }

  public get_question(): Question {
    const { rand_digit_big_int, Question } = this.context;
    const
      num = rand_digit_big_int(this.digits, { avoidIsOne: true }),
      factors = this.pff(num),
      problem = num.toString().concat(" 的质因数有:"),
      correctAnswer = factors.map(factor => factor.toString()).join(",");
    return new Question(problem, correctAnswer);
  }

  public get_title(): string {
    return `${this.digits}位数的质因数分解`;
  }
}

export default {
  get_provider(context: QuestionContext, params: string[]): PffQuestionProvider {
    return new PffQuestionProvider(context, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      max: 10,
      default: 3,
    },
  ],
  id: 'pff',
} satisfies QuestionModule;
