<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { CATEGORIES, CategoryId } from '@/assets/question/index';
import useStore from '@/store/index';

import ParamItem from './ParamItem.vue';
import { storeToRefs } from 'pinia';

const
  { set_module } = useStore(),
  { category, questionModule, quantity } = storeToRefs(useStore());

const
  router = useRouter(),
  paramsConfig = computed(() => {
    return questionModule.value.paramsConfig;
  });

function submit_form(ev: Event): void {
  const data = new FormData(ev.target as HTMLFormElement);
  let category = CategoryId.Null;
  let quantity = "";
  let params: string[] = new Array(paramsConfig.value.length);
  data.forEach((value, key) => {
    if (key == 'quantity')
      quantity = value as string;
    else if (key == 'category')
      category = value as CategoryId;
    else if (key.startsWith("param-"))
      params[parseInt(key.substring("param-".length))] = value as string;
    else
      throw Error("Form key error");
  });
  router.push(`/exercise/${category}/${params.join(',')}/${quantity}`);
}

function change_category(ev: Event) {
  set_module((ev.target as HTMLSelectElement).value, "");
}

function change_quantity(ev: Event) {
  quantity.value = (ev.target as HTMLInputElement).valueAsNumber;
}

</script>

<template lang="pug">
div.welcome
  h2.text-3xl.font-bold.py-4 欢迎来到口算练习
  form.w-max.mx-auto.text-lg(@submit.prevent="submit_form")
    div.param-item
      label(for="category") 类别
      span
        select#category(
          name="category"
          title="类别"
          :value="category"
          @change="change_category"
        )
          option(
            v-for="category in CATEGORIES"
            :value="category.id"
            :key="category.id"
          ) {{ category.desc }}
    div.param-item
      label(for="quantity") 题数
      span
        input#quantity(
          type="number"
          name="quantity"
          min="1"
          step="1"
          placeholder="练习题数..."
          required="true"
          :value="quantity"
          @change="change_quantity"
        )
    ParamItem(
      v-for="(config, i) in paramsConfig"
      :key="`${category}-${i}`"
      :i="i"
      :config="config"
    )
    div.text-right.relative.left-4.top-4
      button.btn.bg-blue-500(type="submit") 提交
</template>

<style lang="scss">
.welcome {
  .param-item {
    @apply w-fit;

    >label {
      @apply text-left block w-fit;
    }

    >span {
      @apply block;
    }

    input,
    select {
      @apply w-64 text-xl inline-block border border-gray-300 px-2 rounded;
    }
  }
}
</style>
