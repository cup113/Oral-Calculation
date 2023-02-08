// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

import AppVue from "@/App.vue";

let el = document.createElement("div");
const app = createApp(AppVue);
app.use(createPinia());
app.use(router);

describe("vue-app", () => {
  it("initialize", () => {
    app.mount(el);
  });
  it.todo("dom");
})
