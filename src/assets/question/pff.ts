import type bigInt from 'big-integer';
import type { QuestionProvider, Dependency, Question, QuestionModule } from './index';

class PffQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;

  constructor(dep: Dependency, params: string[]) {
    this.dep = dep;
    this.digits = parseInt(params[0]);
  }

  private pff(num: bigInt.BigInteger): bigInt.BigInteger[] {
    const { bigInt } = this.dep;
    let divisor = bigInt[2], value = num;
    // TODO sqrt optimize
    let ans: bigInt.BigInteger[] = [];
    while (divisor.lt(value)) {
      if (value.isDivisibleBy(divisor)) {
        ans.push(divisor);
        value = value.divide(bigInt(divisor)); // reference to owned
      } else {
        divisor = divisor.add(1);
      }
    }
    ans.push(divisor);
    return ans;
  }

  public get_question(): Question {
    const { rand_big_int, Question } = this.dep;
    const
      num = rand_big_int(this.digits),
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
  get_provider(bigIntModule: Dependency, params: string[]): PffQuestionProvider {
    return new PffQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      default: 3,
    },
  ],
} satisfies QuestionModule;
