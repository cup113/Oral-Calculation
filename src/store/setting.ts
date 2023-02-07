import { defineStore } from 'pinia';
import { ref } from 'vue';

import { PARAMS_SEP, bool_to_string, string_to_bool } from '@/assets/util';
import { CATEGORIES, CategoryId } from '@/assets/question';

export default defineStore("setting", () => {
  /** The keys of localStorage */
  const enum LocalStorageKeys {
    /** Default category. The id string of the category. */
    CategoryId = "OC_CategoryId",
    /** Default quantity. A decimal number. */
    Quantity = "OC_Quantity",
    /** Default param **prefix**. Each stores an array-string joined by ','. */
    Params = "OC_Params",
    /** Avoid repeated questions as possible. */
    AvoidRepeat = "OC_AvoidRepeat",
    /** If generate the questions as soon as the provider loaded. */
    GenerateAtOnce = "OC_GenerateAtOnce",
  }

  /** Basic getter for `localStorage`.
   * @returns the value of `key` in `localStorage`. If null, return `defaultValue`.
   */
  function storage_get(key: string, defaultValue: string): string {
    return localStorage.getItem(key) ?? defaultValue;
  }

  /** Basic setter for `localStorage`. */
  function storage_set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  const
    categoryId = ref(CategoryId.Null),
    quantity = ref(10),
    params = ref([] as string[]),
    avoidRepeat = ref(true),
    generateAtOnce = ref(false);

  const categoryIdManager = {
    validate(_category: string): _category is CategoryId {
      return !CATEGORIES.every(c => c.id !== _category);
    },
    get(): CategoryId {
      let ans = storage_get(LocalStorageKeys.CategoryId, categoryId.value);
      if (this.validate(ans))
        return ans;
      return categoryId.value;
    },
    set(_category: string): _category is CategoryId {
      if (this.validate(_category)) {
        categoryId.value = _category;
        storage_set(LocalStorageKeys.CategoryId, _category);
        return true;
      }
      return false;
    }
  };

  const quantityManager = {
    validate(value: number): boolean {
      const MIN_QUANTITY = 1;
      if (!Number.isInteger(value))
        return false;
      return value >= MIN_QUANTITY;
    },
    get(): number {
      let value = parseInt(storage_get(LocalStorageKeys.Quantity, quantity.value.toString()));
      if (this.validate(value))
        return value;
      return quantity.value;
    },
    set(_quantity: string): boolean {
      let value = parseInt(_quantity);
      if (this.validate(value)) {
        quantity.value = value;
        storage_set(LocalStorageKeys.Quantity, _quantity);
        return true;
      }
      return false;
    }
  };

  const paramsManager = {
    filter_empty(arr: string[]) {
      if (arr.length === 1 && arr[0].length === 0) // arr: ['']
        arr.splice(0, arr.length);
      return arr;
    },
    get(): string[] {
      return this.filter_empty(storage_get(
        `${LocalStorageKeys.Params}_${categoryId.value}`,
        params.value.join(PARAMS_SEP)
      ).split(PARAMS_SEP));
    },
    set(_params: string): void {
      params.value = this.filter_empty(_params.split(PARAMS_SEP));
      storage_set(`${LocalStorageKeys.Params}_${categoryId.value}`, _params);
    }
  };

  const avoidRepeatManager = {
    get(): boolean {
      return string_to_bool(storage_get(
        LocalStorageKeys.AvoidRepeat, bool_to_string(avoidRepeat.value)
      ));
    },
    set(_avoidRepeat: string): void {
      let value = string_to_bool(_avoidRepeat);
      avoidRepeat.value = value;
      storage_set(LocalStorageKeys.AvoidRepeat, _avoidRepeat);
    }
  };

  const generateAtOnceManager = {
    get(): boolean {
      return string_to_bool(storage_get(
        LocalStorageKeys.GenerateAtOnce, bool_to_string(generateAtOnce.value)
      ));
    },
    set(_generateAtOnce: string): void {
      let value = string_to_bool(_generateAtOnce);
      generateAtOnce.value = value;
      storage_set(LocalStorageKeys.GenerateAtOnce, _generateAtOnce);
    }
  };

  categoryId.value = categoryIdManager.get();
  quantity.value = quantityManager.get();
  avoidRepeat.value = avoidRepeatManager.get();
  generateAtOnce.value = generateAtOnceManager.get();
  params.value = paramsManager.get();

  return {
    categoryId,
    categoryIdManager,
    quantity,
    quantityManager,
    avoidRepeat,
    avoidRepeatManager,
    generateAtOnce,
    generateAtOnceManager,
    params,
    paramsManager,
    PARAMS_SEP,
  };
});
