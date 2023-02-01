import { QuestionProvider, Dependency, Question, QuestionModule, empty_array } from './index';

type Sign = '+' | '-';

class AddSubQuestionProvider implements QuestionProvider {
  private dep: Dependency;
  public digits: number;
  public items: number;
  public mixedSetting: number;
  public allowNegative: boolean;

  constructor(dep: Dependency, params: string) {
    const paramArr = params.split(",");
    this.dep = dep;
    this.digits = parseInt(paramArr[0]);
    this.items = parseInt(paramArr[1]);
    this.mixedSetting = parseInt(paramArr[2]);
    this.allowNegative = paramArr[3] === '1';
  }

  private get_question_mixed(): Question {
    const { rand_big_int, empty_array, Question } = this.dep;
    while (true) {
      let
        numbers = empty_array(this.items).map(() => rand_big_int(this.digits)),
        signs = [] as Sign[],
        tmpAns = numbers[0];
      for (let i = 1; i < this.items; ++i) {
        let sign: Sign;
        if (!this.allowNegative && tmpAns.lt(numbers[i]))
          sign = '+';
        else
          sign = Math.random() < 0.4 ? '+' : '-';
        signs.push(sign);
        tmpAns = sign === '+' ? tmpAns.add(numbers[i]) : tmpAns.minus(numbers[i]);
      }
      if (this.mixedSetting === 0 && signs.every((value) => value === signs[0]))
        continue;
      let
        problem = numbers[0].toString() + signs.map(
          (value, index) => ` ${value} ${numbers[index + 1].toString()}`
        ).join("").concat(" = ?"),
        correctAnswer = tmpAns.toString();
      return new Question(problem, correctAnswer);
    }
  }

  private get_question_not_mixed(): Question {
    const { rand_big_int, bigInt, Question } = this.dep;
    const sign: Sign = Math.random() < 0.4 ? '+' : '-';
    if (sign == '+') {
      const
        numbers = empty_array(this.items).map(() => rand_big_int(this.digits)),
        problem = numbers.map(num => num.toString()).join(" + ").concat(" = ?"),
        correctAnswer = numbers.reduce(
          (pre, cur) => pre.add(cur), bigInt[0]
        ).toString();
      return new Question(problem, correctAnswer);
    } else if (this.allowNegative) {
      const
        numbers = empty_array(this.items).map(() => rand_big_int(this.digits)),
        problem = numbers.map(num => num.toString()).join(" - ").concat(" = ?"),
        correctAnswer = numbers.reduce(
          (pre, cur) => pre.minus(cur), numbers[0].multiply(2)
        ).toString();
      return new Question(problem, correctAnswer);
    } else {
      const
        correctAnswer = rand_big_int(this.digits),
        numbers = empty_array(this.items - 1).map(() => rand_big_int(this.digits)),
        firstNum = numbers.reduce((pre, cur) => pre.add(cur), bigInt(correctAnswer)),
        problem = firstNum.toString().concat(
          numbers.map(num => ` - ${num.toString()}`).join(""),
          " = ?"
        );
      return new Question(problem, correctAnswer.toString());
    }
  }

  public get_question(): Question {
    switch (this.mixedSetting) {
      case 0: case 1:
        return this.get_question_mixed();
      default:
        return this.get_question_not_mixed();
    }
  }

  public get_title(): string {
    if (this.mixedSetting === 2)
      return `${this.digits}位数加减混合运算`
    else
      return `${this.digits}位数连加连减运算`;
  }
}

export default {
  get_provider(bigIntModule: Dependency, params: string): AddSubQuestionProvider {
    return new AddSubQuestionProvider(bigIntModule, params);
  },
  paramsConfig: [
    {
      type: 'integer',
      name: "位数",
      min: 1,
      default: 2,
    },
    {
      type: 'integer',
      name: "运算项个数",
      min: 2,
      default: 3,
    },
    {
      type: 'select',
      name: "加减法选项",
      choices: ["全部加减混合", "随机决定", "全部连加或连减"],
      default: 0,
    },
    {
      type: 'select',
      name: '允许负数',
      choices: ["不允许", "允许"],
      default: 0,
    }
  ],
} satisfies QuestionModule;
