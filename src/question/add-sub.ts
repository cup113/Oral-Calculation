import { defineQuestionModule } from './index';

type Params = { digits: number; items: number; mixedSetting: number; allowNegative: boolean };

type Sign = '+' | '-';

const enum MixedSetting {
  AllMixed = 0,
  Random = 1,
  AllSame = 2,
}

function get_question_mixed(context: import('./index').QuestionContext, digits: number, items: number, mixedSetting: MixedSetting, allowNegative: boolean) {
  const { rand_digit_big_int, empty_array, Question } = context;
  while (true) {
    let
      numbers = empty_array(items).map(() => rand_digit_big_int(digits)),
      signs = [] as Sign[],
      tmpAns = numbers[0];
    for (let i = 1; i < items; ++i) {
      let sign: Sign;
      if (!allowNegative && tmpAns.lt(numbers[i]))
        sign = '+';
      else
        sign = Math.random() < 0.4 ? '+' : '-';
      signs.push(sign);
      tmpAns = sign === '+' ? tmpAns.add(numbers[i]) : tmpAns.minus(numbers[i]);
    }
    if (mixedSetting === MixedSetting.AllMixed && signs.every((value) => value === signs[0]))
      continue;
    let
      problem = numbers[0].toString() + signs.map(
        (value, index) => ` ${value} ${numbers[index + 1].toString()}`
      ).join("").concat(" = ?"),
      correctAnswer = tmpAns.toString();
    return new Question(problem, correctAnswer);
  }
}

function get_question_not_mixed(context: import('./index').QuestionContext, digits: number, items: number, allowNegative: boolean) {
  const { rand_digit_big_int, bigInt, Question, empty_array } = context;
  const sign: Sign = Math.random() < 0.4 ? '+' : '-';
  if (sign == '+') {
    const
      numbers = empty_array(items).map(() => rand_digit_big_int(digits)),
      problem = numbers.map(num => num.toString()).join(" + ").concat(" = ?"),
      correctAnswer = numbers.reduce(
        (pre, cur) => pre.add(cur), bigInt[0]
      ).toString();
    return new Question(problem, correctAnswer);
  } else if (allowNegative) {
    const
      numbers = empty_array(items).map(() => rand_digit_big_int(digits)),
      problem = numbers.map(num => num.toString()).join(" - ").concat(" = ?"),
      correctAnswer = numbers.reduce(
        (pre, cur) => pre.minus(cur), numbers[0].multiply(2)
      ).toString();
    return new Question(problem, correctAnswer);
  } else {
    const
      correctAnswer = rand_digit_big_int(digits),
      numbers = empty_array(items - 1).map(() => rand_digit_big_int(digits)),
      firstNum = numbers.reduce((pre, cur) => pre.add(cur), bigInt(correctAnswer)),
      problem = firstNum.toString().concat(
        numbers.map(num => ` - ${num.toString()}`).join(""),
        " = ?"
      );
    return new Question(problem, correctAnswer.toString());
  }
}

export default defineQuestionModule<Params>({
  id: 'add-sub',
  paramsConfig: [
    { key: 'digits', name: "位数", type: 'integer', min: 1, default: 2 },
    { key: 'items', name: "运算项个数", type: 'integer', min: 3, default: 3 },
    { key: 'mixedSetting', name: "加减法选项", type: 'select', choices: ["全部加减混合", "随机决定", "全部连加或连减"], default: 0 },
    { key: 'allowNegative', name: '允许负数', type: 'boolean', default: 0 },
  ],
  generate(context, params) {
    switch (params.mixedSetting as MixedSetting) {
      case MixedSetting.AllMixed: case MixedSetting.Random:
        return get_question_mixed(context, params.digits, params.items, params.mixedSetting, params.allowNegative);
      case MixedSetting.AllSame:
        return get_question_not_mixed(context, params.digits, params.items, params.allowNegative);
    }
  },
  get_title(params) {
    switch (params.mixedSetting as MixedSetting) {
      case MixedSetting.AllMixed: case MixedSetting.Random:
        return `${params.digits}位数加减混合运算`;
      case MixedSetting.AllSame:
        return `${params.digits}位数连加连减运算`;
    }
  },
});
