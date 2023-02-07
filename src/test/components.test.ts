// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, createVNode, createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

import AppVue from "@/App.vue";
import CustomizedFooterVue from "@/components/CustomizedFooter.vue";
import DurationVue from "@/components/Duration.vue";
import ExerciseVue from "@/components/Exercise.vue";
import ParamItemVue from "@/components/ParamItem.vue";
import QuestionDisplayVue from "@/components/QuestionDisplay.vue";
import WelcomeVue from "@/components/Welcome.vue";

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
