// @vitest-environment jsdom

import { createApp } from 'vue';
import { describe, expect, assert, it } from 'vitest';
import { createPinia } from 'pinia';

import useSettingStore from '@/store/setting';
import useQuestionStore from '@/store/question';
import useMistakesStore from '@/store/mistakes';

import App from '@/App.vue';

const app = createApp(App);
app.use(createPinia());

describe("store-setting", () => {
  const store = useSettingStore();

  it.todo("category", () => {});
  it.todo("quantity", () => {});
  it.todo("avoid-repeat", () => {});
  it.todo("generate-at-once", () => {});
  it.todo("params", () => {});
});

describe("store-question", () => {
  const store = useQuestionStore();

  it.todo("reset-questions", () => {});
  it.todo("get-question", () => {});
  it.todo("add-question", () => {});
  it.todo("update-question", () => {});
  it.todo("answer-current-question", () => {});
});

describe("store-mistakes", () => {
  const store = useMistakesStore();

  it.todo("");
})
