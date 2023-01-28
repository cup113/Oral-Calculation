import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Message from 'vue-m-message';

import { CategoryId, DEP, Question, QuestionModule } from '@/assets/question/index';
import LoadingQuestion from '@/assets/question/loading';

export default defineStore("index", () => {
  const enum LocalStorageKeys {
    Category = "OC-Category",
    Params = "OC-Params",
  }

  const
    category = ref(CategoryId.Null),
    questionModule = ref(LoadingQuestion),
    params = ref(""),
    loaded = computed(() => questionModule.value !== LoadingQuestion),
    questions = ref([] as Question[]),
    questionProvider = computed(
      () => questionModule.value.get_provider(DEP, params.value)
    );

  function set_module(_category: string, _params: string): Promise<QuestionModule> {
    category.value = _category as CategoryId;
    params.value = _params;
    localStorage.setItem(LocalStorageKeys.Category, _category);
    localStorage.setItem(LocalStorageKeys.Params, _params);
    return get_module()
      .then(
        (m) => {
          questionModule.value = m.default;
          return m.default;
        },
        (e) => {
          Message.error("获取该类别模块失败: " + e);
          return LoadingQuestion;
        }
      );
  }

  async function get_module(): Promise<{ default: QuestionModule }> {
    switch (category.value) {
      case CategoryId.Add:
        return import("@/assets/question/add");
      case CategoryId.Sub:
        return import("@/assets/question/sub");
      case CategoryId.AddSub:
        return import("@/assets/question/add-sub");
      case CategoryId.Mul:
        return import("@/assets/question/mul");
      case CategoryId.Div:
        return import("@/assets/question/div");
      case CategoryId.Arithmetic:
        return Promise.reject("该模块尚未完成"); // TODO
      case CategoryId.Pow:
        return Promise.reject("该模块尚未完成"); // TODO
      case CategoryId.PFF:
        return Promise.reject("该模块尚未完成"); // TODO
      case CategoryId.Disc2:
        return Promise.reject("该模块尚未完成"); // TODO
      case CategoryId.Sqrt:
        return Promise.reject("该模块尚未完成"); // TODO
      default:
        return Promise.resolve({ default: LoadingQuestion });
    }
  }

  set_module(
    localStorage.getItem(LocalStorageKeys.Category) ?? "0",
    localStorage.getItem(LocalStorageKeys.Params) ?? ""
  );

  return {
    category,
    questionModule,
    questionProvider,
    questions,
    loaded,
    params,
    set_module,
  };
});
