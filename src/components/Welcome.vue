<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { CATEGORIES, CategoryId } from '@/assets/question/index';
import useStore from '@/store/index';

import ParamItem from './ParamItem.vue';
import { storeToRefs } from 'pinia';

const
  { set_module } = useStore(),
  { category, questionModule } = storeToRefs(useStore());

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
  })
  router.push(`/exercise/${category}/${params.join(',')}/${quantity}`);
}

function change_category(ev: Event) {
  set_module((ev.target as HTMLSelectElement).value, "");
}

</script>

<template lang="pug">
.welcome
  h2 欢迎来到口算练习
  form(@submit.prevent="submit_form")
    div.row
      label.col-form-label(for="category") 类别
      span
        select#category.form-control(
          name="category"
          :value="category"
          @change="change_category"
          title="类别"
        )
          option(
            v-for="category in CATEGORIES"
            :value="category.id"
            :key="category.id"
          ) {{ category.desc }}
    div.row
      label.col-form-label(for="quantity") 题数
      span
        input#quantity.form-control(
          type="number"
          name="quantity"
          min="1"
          step="1"
          placeholder="练习题数..."
          required="true"
        )
    ParamItem(
      v-for="(config, i) in paramsConfig"
      :key="`${category}-${i}`"
      :i="i"
      :config="config"
    )
    div.submit
      button.btn.btn-primary(type="submit") 提交
</template>

<style lang="scss">
@import 'bootstrap/scss/_functions.scss';

@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';

@import 'bootstrap/scss/_buttons.scss';
@import 'bootstrap/scss/_forms.scss';

.welcome {
  >form {
    width: max-content;
    margin: 0 auto;
    text-align: center;
    font-size: 1.2em;

    >.row {
      margin-top: 0.5em;
      width: fit-content;

      >label {
        display: inline-block;
        width: 8em;
        margin-right: 1em;
      }

      >span {
        display: inline-block;
        width: 12em;
      }

    }

    >.submit {
      text-align: right;
      position: relative;
      left: 1em;
      top: 1em;
    }
  }
}
</style>
