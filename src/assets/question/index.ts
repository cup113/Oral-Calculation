/** Question utilities & manager. */

import bigInt from 'big-integer';

import type { Milliseconds } from '@/assets/util';
import { empty_array } from '@/assets/util';
import LoadingQuestion from './loading';

/** Ids of categories. Used in select value, module getting, etc. */
export const enum CategoryId {
  Null = "null",
  Add = "add",
  Sub = "sub",
  AddSub = "add-sub",
  Mul = "mul",
  Div = "div",
  Pow = "pow",
  Pff = "pff",
  Disc2 = "disc-2",
  Sqrt = "sqrt",
}

/** Category interface */
export interface Category {
  id: CategoryId,
  desc: string,
}

/** Categories of questions */
export const CATEGORIES: Category[] = [
  { id: CategoryId.Null, desc: "--请选择--" },
  { id: CategoryId.Add, desc: "加法" },
  { id: CategoryId.Sub, desc: "减法" },
  { id: CategoryId.AddSub, desc: "加减混合" },
  { id: CategoryId.Mul, desc: "乘法" },
  { id: CategoryId.Div, desc: "除法" },
  { id: CategoryId.Pow, desc: "幂运算" },
  { id: CategoryId.Pff, desc: "分解质因数" },
  { id: CategoryId.Disc2, desc: "一元二次方程根的判别式" },
  { id: CategoryId.Sqrt, desc: "开平方" },
];

/** Get the correspond question provider module.
 * @param categoryId the id of the category.
 * @returns Promise with a module in it. You should take it by `.default`.
 */
export async function get_module(categoryId: CategoryId): Promise<{ default: QuestionModule }> {
  switch (categoryId) {
    case CategoryId.Add:
      return import('./add');
    case CategoryId.Sub:
      return import('./sub');
    case CategoryId.AddSub:
      return import('./add-sub');
    case CategoryId.Mul:
      return import('./mul');
    case CategoryId.Div:
      return import('./div');
    case CategoryId.Pow:
      return import('./pow');
    case CategoryId.Pff:
      return import("./pff");
    case CategoryId.Disc2:
      return import("./disc-2");
    case CategoryId.Sqrt:
      return import("./sqrt");
    case CategoryId.Null:
      return Promise.resolve({ default: LoadingQuestion });
  }
}

/** Get the minimum value and the maximum value of a fixed digit of big integer.
 * - Time complexity: **O(N^2 log N)**, N=`digits`
 * - Space complexity: **O(N)**, N=`digits`
 * @param digits A positive integer
 * @returns `[minimumValue, maximumValue]`
 */
function minmax_big_int(digits: number): [bigInt.BigInteger, bigInt.BigInteger] {
  if (digits < 0)
    digits = 0;
  if (!Number.isInteger(digits))
    digits = Math.floor(digits);
  const
    l = bigInt[10].pow(digits - 1),
    r = l.multiply(10).minus(1);
  return [l, r];
}

/** `rand_digit_big_int` option */
interface RandDigitOption {
  /** If `1` is not allowed to be the result.
   * @default false
   */
  avoidIsOne?: boolean,
  /** If the last digit of the value is not allowed to be `0`.
   * @default false
   */
  avoidEndsWithZero?: boolean,
}

/** Get a random big integer of a fixed digit. i.e. between `minmax_big_int(digit)`.
 * - Time complexity: **O(N logN)**, N=`digits`
 * - Space complexity: **O(N)**, N=`digits`
 * @param digits The fixed digit.
 * @returns A random big integer.
 */
function rand_digit_big_int(digits: number, option: RandDigitOption = {}): bigInt.BigInteger {
  if (digits <= 0)
    digits = 1;
  while (true) {
    let [l, r] = minmax_big_int(digits);
    if (option.avoidIsOne && l.eq(bigInt[1]))
      l = bigInt[2]; // This still keeps the distribution average.
    let ans = bigInt.randBetween(l, r);
    if (option.avoidEndsWithZero && ans.mod(10).isZero())
      continue;
    return ans;
  }
}

/** Get a random **number**.
 * - Time complexity: **O(N)**, N=`abs(powAddition)`
 * - Space complexity: **O(1)**
 * @param powAddition The addition of power. Positive means `random^n`, Negative means `1-random^abs(n)`
 * @returns the random number between `lowerBound` and `upperBound`.
 */
function rand_between(
  lowerBound: number,
  upperBound: number,
  powAddition: number = 0
): number {
  let ansBase = Math.random();
  let refreshFunc = powAddition > 0 ? Math.max : Math.min;
  powAddition = Math.abs(powAddition);
  for (let i = 1; i < powAddition; ++i)
    ansBase = refreshFunc(ansBase, Math.random());
  return Math.floor(ansBase * (upperBound - lowerBound + 1)) + lowerBound;
}

/** Get a random **big integer**.
 * - Time complexity: **O(MN logM)**, M=`log(upperBound)`, N=`abs(powAddition)`
 * - Space complexity: **O(M)**, M=`log(upperBound)`
 * @param powAddition The addition of power. Positive means `random^n`,
 * Negative means `1-random^abs(n)`
 * @returns the random number between `lowerBound` and `upperBound`.
 */
function rand_between_big_int(
  lowerBound: bigInt.BigInteger,
  upperBound: bigInt.BigInteger,
  powAddition: number = 0
): bigInt.BigInteger {
  let ans = bigInt.randBetween(lowerBound, upperBound);
  let refreshFunc = powAddition > 0 ? bigInt.max : bigInt.min;
  powAddition = Math.abs(powAddition);
  for (let i = 1; i < powAddition; ++i)
    ans = refreshFunc(ans, bigInt.randBetween(lowerBound, upperBound));
  return ans;
}

/** Give the number a random sign (50% `+` , 50% `-`).
 * - Time complexity: **O(M)**, M=`log(num)`
 * - Space complexity: **O(M)**, M=`log(num)`
 * @param num the original number
 * @returns the number after randomly signed.
 */
function rand_sign(num: bigInt.BigInteger) {
  return num.multiply(Math.random() < 0.5 ? 1 : -1);
}

/** Return the integer part and the remainder of the square root of the number.
 * - Time complexity: **O(N^2 log N^2)**, N=log(num)
 * - Space complexity: **O(N)**, N=log(num)
 * @param num The number to be operated
 * @return `[integer, remainder]`
 */
function sqrt_big_int(num: bigInt.BigInteger): [bigInt.BigInteger, bigInt.BigInteger] {
  if (num.leq(bigInt[1]))
    return [bigInt(num), bigInt[0]];
  let left = bigInt[1];
  while (left.square().lt(num))
    left = left.multiply(2);
  let right = left;
  left = left.divide(2);
  while (left.add(1).lt(right)) {
    let mid = left.add(right).divide(2);
    switch (mid.square().compare(num)) {
      case 0:
        return [mid, bigInt[0]];
      case 1:
        right = mid;
        break;
      case -1:
        left = mid;
        break;
    }
  }
  if (right.square().eq(num))
    return [right, bigInt[0]];
  return [left, num.minus(left.square())];
}

/** The result of `Question.prototype.try_answer` */
export const enum AnswerResult {
  /// Answer is correct.
  Correct,
  /// Answer is wrong because it's empty.
  WrongEmpty,
  /// Answer is wrong. It has appeared before.
  WrongAnswered,
  /// Answer is wrong. It hasn't appeared before.
  WrongNew,
}

/** The class to express a question. */
export class Question {
  /** The problem expressed by string. */
  public readonly problem: string;
  /** The correct answer expressed by string. */
  public readonly correctAnswer: string;
  /** The time when it is started to be answered. */
  public readonly start: Date;
  /** The time when it is answered correctly, or it would be the same as `start`. */
  public end: Date;
  /** If the question is passed. */
  public passed: boolean;
  /** Wrong answers that have been answered by the user, to avoid being answered for many times. */
  public wrongAnswers: Set<string>;

  /** Construct a question. */
  constructor(problem: string, correctAnswer: string) {
    this.problem = problem;
    this.correctAnswer = correctAnswer;
    this.start = new Date();
    this.end = new Date(this.start);
    this.passed = false;
    this.wrongAnswers = new Set();
  }

  /** Try answering the question and modify internal data. */
  public try_answer(answer: string): AnswerResult {
    if (answer === this.correctAnswer) {
      this.passed = true;
      this.end = new Date();
      return AnswerResult.Correct;
    } else {
      if (answer.length === 0)
        return AnswerResult.WrongEmpty;
      if (this.wrongAnswers.has(answer))
        return AnswerResult.WrongAnswered;
      this.wrongAnswers.add(answer);
      return AnswerResult.WrongNew;
    }
  }

  /** Get the duration of the question.
   * Note: This should be called when `this.passed`.
   */
  public get_duration(): Milliseconds {
    return this.end.getTime() - this.start.getTime();
  }

  /** Get the time passed from `this.start`.
   * Note: This should be called when `!this.passed`.
   */
  public get_elapsed(): Milliseconds {
    return new Date().getTime() - this.start.getTime();
  }

  /** Get if the question is answered correctly at the first time. */
  public is_first_time_correct(): boolean {
    return this.wrongAnswers.size === 0;
  }

  /** New a question which shows the question provider module is loaded. */
  static new_loaded(): Question {
    return new Question("加载完毕。", "");
  }
}

/** Fraction class of `bigInt.BigInteger` */
class Fraction {
  /** (**p**) / q */
  public numerator: bigInt.BigInteger;
  /** p / (**q**) */
  public denominator: bigInt.BigInteger;

  /** Construct a fraction from numerator and denominator */
  constructor(numerator: bigInt.BigInteger, denominator: bigInt.BigInteger) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  /** Return as a string with no whitespace. */
  public toString(): string {
    return `${this.numerator.toString()}/${this.denominator.toString()}`;
  }

  /** Reduce itself by using `gcd`. */
  public reduce(): void {
    const gcd = bigInt.gcd(this.numerator, this.denominator);
    this.numerator = this.numerator.divide(gcd);
    this.denominator = this.denominator.divide(gcd);
  }
}

/** Global-singleton question context dependency. */
export const QUESTION_CONTEXT = {
  bigInt,
  minmax_big_int,
  sqrt_big_int,
  rand_digit_big_int,
  rand_between,
  rand_between_big_int,
  rand_sign,
  empty_array,
  Question,
  Fraction,
};

/** Type of `context` to be used by question provider to reduce packaged size. */
export type QuestionContext = typeof QUESTION_CONTEXT;

/** Part of `QuestionModule` */
export interface QuestionProvider {
  get_question(): Question;
  get_title(): string;
}

/** The config of param */
export type ParamConfig = {
  name: string,
  type: 'integer',
  default: number,
  min: number,
  max?: number,
} | {
  name: string,
  type: 'select',
  choices: string[],
  /** The default choice. Start from 0 index */
  default: number,
}

/** Question module interface. (implemented in files under `question` directory.) */
export interface QuestionModule {
  /** Get the question provider of the module.
   * @param context The question context.
   * @param params Parameters correspond to `paramsConfig` of the module.
   * @returns The question provider
   */
  get_provider(context: QuestionContext, params: string[]): QuestionProvider,
  /** The configuration of parameters of the question provider. */
  paramsConfig: ParamConfig[],
  /** The optional **extra** validator to check if params are legal.
   * @returns Error information if the params are illegal, **or an empty string**.
   */
  validate?: (params: string[]) => string;
  /** The category id of the module. Specially, the id of loading module is `loading`. */
  id: string;
}
