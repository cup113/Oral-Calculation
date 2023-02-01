import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Message from 'vue-m-message';

import { CategoryId, DEP, Question, QuestionModule, get_module } from '@/assets/question/index';
import LoadingQuestion from '@/assets/question/loading';

export default defineStore("index", () => {
  const enum LocalStorageKeys {
    Category = "OC_Category",
    Params = "OC_Params",
    Quantity = "OC_Quantity"
  }

  const
    category = ref(CategoryId.Null),
    questionModule = ref(LoadingQuestion as QuestionModule),
    params = ref(""),
    loaded = computed(() => questionModule.value !== LoadingQuestion),
    questions = ref([] as Question[]),
    questionProvider = computed(
      () => questionModule.value.get_provider(DEP, params.value.split(","))
    ),
    quantity = ref(parseInt(
      localStorage.getItem(LocalStorageKeys.Quantity) ?? "10"
    ));

  function set_module(_category: string, _params: string): Promise<QuestionModule> {
    category.value = _category as CategoryId;
    params.value = _params;
    localStorage.setItem(LocalStorageKeys.Category, _category);
    localStorage.setItem(LocalStorageKeys.Params, _params);
    return get_module(category.value)
      .then(
        (m) => {
          questionModule.value = m.default;
          return m.default;
        },
        (e) => {
          Message.error("获取该类别模块失败: " + e);
          return questionModule.value;
        }
      );
  }

  function set_quantity(_quantity: number): boolean {
    if (isNaN(_quantity) || _quantity <= 0)
      return false;
    quantity.value = _quantity;
    localStorage.setItem(LocalStorageKeys.Quantity, _quantity.toString());
    return true;
  }

  set_module(
    localStorage.getItem(LocalStorageKeys.Category) ?? CategoryId.Null,
    localStorage.getItem(LocalStorageKeys.Params) ?? ""
  );
  set_quantity(parseInt(
    localStorage.getItem(LocalStorageKeys.Quantity) ?? "0"
  ));

  return {
    category,
    questionModule,
    questionProvider,
    questions,
    loaded,
    params,
    quantity,
    set_module,
    set_quantity,
  };
});
