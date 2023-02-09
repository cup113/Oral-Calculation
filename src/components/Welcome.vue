<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Message from 'vue-m-message';

import { CATEGORIES, CategoryId } from '@/question';
import useQuestionStore from '@/store/question';
import useSettingStore from '@/store/setting';

import ParamItem from './ParamItem.vue';

const
  { questionModule } = storeToRefs(useQuestionStore()),
  { categoryIdManager, quantityManager, avoidRepeatManager, generateAtOnceManager } = useSettingStore(),
  { categoryId, quantity, params, avoidRepeat, generateAtOnce } = storeToRefs(useSettingStore());

const
  router = useRouter(),
  paramsConfig = computed(() => {
    return questionModule.value.paramsConfig;
  });

function go_to_mistakes_collection() {
  router.push("/mistakes-collection");
}

function submit_form(ev: Event): void {
  const data = new FormData(ev.target as HTMLFormElement);
  if (data.get("category") === CategoryId.Null) {
    Message.warning("请选择类别");
    return;
  }
  let params: string[] = new Array(paramsConfig.value.length);
  data.forEach((value, key) => {
    if (key.startsWith("param-"))
      params[parseInt(key.substring("param-".length))] = value as string;
  });
  router.push(`/exercise/${categoryId.value}/${params.join(',')}/${quantity.value}`);
}

function change_category(ev: Event) {
  categoryIdManager.set((ev.target as HTMLSelectElement).value);
}

function change_quantity(ev: Event) {
  quantityManager.set((ev.target as HTMLInputElement).value);
}

function change_avoid_repeat(ev: Event) {
  avoidRepeatManager.set((ev.target as HTMLSelectElement).value);
}

function change_generate_at_once(ev: Event) {
  generateAtOnceManager.set((ev.target as HTMLSelectElement).value);
}

</script>

<template>
  <div class="welcome pt-8 sm:pt-0">
    <button type="button"
      class="btn bg-yellow-700 absolute left-4 top-4"
      @click="go_to_mistakes_collection">错题本</button>
    <h2 class="text-2xl font-bold py-4">欢迎来到口算练习</h2>
    <form class="w-max mx-auto text-lg" @submit.prevent="submit_form">
      <div class="param-item">
        <label for="category">类别</label>
        <span>
          <select id="category" name="category" title="类别" :value="categoryId"
            @change="change_category">
            <option v-for="category in CATEGORIES" :value="category.id" :key="category.id">
              {{ category.desc }}
            </option>
          </select>
        </span>
      </div>
      <div class="param-item">
        <label for="quantity">题数</label>
        <span>
          <input
            id="quantity" name="quantity"
            type="number" required="true"
            min="1" step="1"
            placeholder="练习题数..."
            :value="quantity" @change="change_quantity">
        </span>
      </div>
      <div class="param-item">
        <label for="avoid-repeat">避免重复题</label>
        <span>
          <select
            id="avoid-repeat" name="avoid-repeat"
            title="避免重复题" :value="avoidRepeat" @change="change_avoid_repeat">
            <option value="true">尽量避免</option>
            <option value="false">不避免</option>
          </select>
        </span>
      </div>
      <div class="param-item">
        <label for="generate-at-once">生成题目</label>
        <span>
          <select
            id="generate-at-once" name="generate-at-once"
            title="生成题目"
            :value="generateAtOnce" @change="change_generate_at_once">
            <option value="false">答题时生成</option>
            <option value="true">开始时立即生成</option>
          </select>
        </span>
      </div>
      <hr class="my-2 h-1">
      <ParamItem
        v-for="(config, i) in paramsConfig" :key="`${categoryId}-${i}`"
        :i="i" :config="config" :default="params.length > i ? params[i] : undefined">
      </ParamItem>
      <div class="text-right relative left-4 top-4">
        <button class="btn bg-blue-500" type="submit">开始练习</button>
      </div>
    </form>
  </div>
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
