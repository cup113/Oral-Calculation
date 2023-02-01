import bigInt from "big-integer";
import LoadingQuestion from './loading';

export const enum CategoryId {
  Null = "null",
  Add = "add",
  Sub = "sub",
  AddSub = "add-sub",
  Mul = "mul",
  Div = "div",
  Arithmetic = "arithmetic",
  Pow = "pow",
  PFF = "pff",
  Disc2 = "disc-2",
  Sqrt = "sqrt",
}

export const CATEGORIES: Category[] = [
  { id: CategoryId.Null, desc: "--请选择--" },
  { id: CategoryId.Add, desc: "加法" },
  { id: CategoryId.Sub, desc: "减法" },
  { id: CategoryId.AddSub, desc: "加减混合" },
  { id: CategoryId.Mul, desc: "乘法" },
  { id: CategoryId.Div, desc: "除法" },
  { id: CategoryId.Arithmetic, desc: "四则运算" },
  { id: CategoryId.Pow, desc: "幂运算" },
  { id: CategoryId.PFF, desc: "分解质因数" },
  { id: CategoryId.Disc2, desc: "一元二次方程根的判别式" },
  { id: CategoryId.Sqrt, desc: "开平方" },
];

export interface RandOption {
  avoidIsOne?: boolean,
  avoidEndsWithZero?: boolean,
}

export function minmax_big_int(digits: number): [bigInt.BigInteger, bigInt.BigInteger] {
  const
    l = bigInt[10].pow(digits - 1),
    r = l.multiply(10).minus(1);
  return [l, r];
}

export function rand_big_int(digits: number, option: RandOption = {}): bigInt.BigInteger {
  if (digits <= 0)
    digits = 1;
  while (true) {
    let [l, r] = minmax_big_int(digits);
    if (option.avoidIsOne && l.eq(bigInt[1]))
      l = bigInt[2];
    let ans = bigInt.randBetween(l, r);
    if (option.avoidEndsWithZero && ans.mod(10).isZero())
      continue;
    return ans;
  }
}

export function empty_array(length: number): (0)[] {
  return new Array(length).fill(0);
}

export type Milliseconds = number;

export class Question {
  public problem: string;
  public correctAnswer: string;
  public start: Date;
  public end: Date;
  public wrongAnswers: Set<string>;

  constructor(problem: string, correctAnswer: string) {
    this.problem = problem;
    this.correctAnswer = correctAnswer;
    this.start = new Date();
    this.end = new Date();
    this.wrongAnswers = new Set();
  }

  public get_duration(): Milliseconds {
    return this.end.getTime() - this.start.getTime();
  }

  public is_first_time_correct(): boolean {
    return this.wrongAnswers.size === 0;
  }

  static new_loaded(): Question {
    return new Question("加载完毕。", "");
  }
}

export class Fraction {
  public numerator: bigInt.BigInteger; // p
  public denominator: bigInt.BigInteger; // q

  constructor(numerator: bigInt.BigInteger, denominator: bigInt.BigInteger) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  public to_string(): string {
    return `${this.numerator.toString()}/${this.denominator.toString()}`;
  }

  public reduce(): void {
    const gcd = bigInt.gcd(this.numerator, this.denominator);
    this.numerator = this.numerator.divide(gcd);
    this.denominator = this.denominator.divide(gcd);
  }
}

export const DEP = {
  bigInt,
  minmax_big_int,
  rand_big_int,
  empty_array,
  Question,
  Fraction,
};

export type Dependency = typeof DEP;

export interface Category {
  id: CategoryId,
  desc: string,
}

export interface QuestionProvider {
  get_question(): Question;
  get_title(): string;
}

export type ParamConfig = {
  name: string,
  type: 'integer',
  default: number,
  min: number,
  max?: number,
} | {
  name: string,
  type: 'select',
  default: number, // from 0
  choices: string[],
};

export interface QuestionModule {
  get_provider(bigInt: Dependency, params: string[]): QuestionProvider,
  paramsConfig: ParamConfig[],
}

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
      return import('./div'); // TODO
    case CategoryId.Arithmetic:
      return Promise.reject("该模块尚未完成"); // TODO
    case CategoryId.Pow:
      return import('./pow');
    case CategoryId.PFF:
      return import("./pff"); // TODO
    case CategoryId.Disc2:
      return Promise.reject("该模块尚未完成"); // TODO
    case CategoryId.Sqrt:
      return Promise.reject("该模块尚未完成"); // TODO
    default:
      return Promise.resolve({ default: LoadingQuestion });
  }
}
