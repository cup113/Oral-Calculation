import { suite, test, assert } from 'vitest';

import { DEP } from '@/assets/question';
import add from '@/assets/question/add';
import sub from '@/assets/question/sub';
import add_sub from '@/assets/question/add';
import mul from '@/assets/question/mul';
import div from '@/assets/question/div';

const { bigInt } = DEP;

suite("question", () => {
  test("add", () => {
    const { get_provider, paramsConfig } = add;
    assert(paramsConfig.length === 1);
    for (let i = 1; i < 10; ++i) {
      let provider = get_provider(DEP, i.toString());
      assert(provider.digits === i);
      assert(provider.get_title().includes(i.toString()));
      assert(provider.get_title().includes("加"));
      for (let j = 0; j < 100; ++j) {
        let question = provider.get_question();
        let problem = /(\d+)\s\+\s(\d+)/.exec(question.problem);
        assert(problem !== null);
        let
          num1 = bigInt(problem[1]),
          num2 = bigInt(problem[2]),
          answer = num1.add(num2);
        assert(num1.toString().length === i);
        assert(num2.toString().length === i);
        assert(question.correctAnswer === answer.toString());
      }
    }
  });

  test("sub", () => {
    const { get_provider, paramsConfig } = sub;
  });

  test("add_sub", () => {
    const { get_provider, paramsConfig } = add_sub;
  });

  test("mul", () => {
    const { get_provider, paramsConfig } = mul;
  });

  test("div", () => {
    const { get_provider, paramsConfig } = div;
  });
});
