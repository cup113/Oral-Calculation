// @vitest-environment jsdom

import { createApp } from 'vue';
import { suite, expect, assert, test } from 'vitest';
import { createPinia } from 'pinia';

import useSettingStore from '@/store/setting';
import useQuestionStore from '@/store/question';

import App from '@/App.vue';

const app = createApp(App);
app.use(createPinia());

suite("store-setting", () => {
  const store = useSettingStore();

  test("category", () => {});
  test("quantity", () => {});
  test("avoid-repeat", () => {});
  test("generate-at-once", () => {});
  test("params", () => {});
});

suite("store-question", () => {
  const store = useQuestionStore();

  test("reset-questions", () => {});
  test("get-question", () => {});
  test("add-question", () => {});
  test("update-question", () => {});
  test("answer-current-question", () => {});
});
