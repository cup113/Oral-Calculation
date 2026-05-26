<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { CATEGORIES } from '@/question';
import useQuestionStore from '@/store/question';
import useSettingStore from '@/store/setting';
import { extractParamsFromFormData, buildExerciseUrl, validatePositiveInteger } from '@/util';

import ParamItem from './ParamItem.vue';

const
  question = useQuestionStore(),
  setting = useSettingStore();

const
  router = useRouter(),
  paramsConfig = computed(() => {
    return question.questionModule.paramsConfig;
  });

document.title = '口算练习';

function go_to_mistakes_collection() {
  router.push("/mistakes-collection");
}

function submit_form(ev: Event): void {
  const data = new FormData(ev.target as HTMLFormElement);
  const params = extractParamsFromFormData(data, paramsConfig.value.length);
  router.push(buildExerciseUrl(setting.categoryId, params, setting.quantity));
}

function change_category(ev: Event) {
  setting.categoryIdManager.set((ev.target as HTMLSelectElement).value);
}

function change_quantity(ev: Event) {
  setting.quantityManager.set((ev.target as HTMLInputElement).value);
}

function input_quantity(ev: Event) {
  const val = (ev.target as HTMLInputElement).value;
  const parsed = validatePositiveInteger(val);
  if (parsed !== null)
    setting.quantityManager.set(val);
}

function toggle_avoid_repeat() {
  setting.avoidRepeatManager.set(String(!setting.avoidRepeat));
}

function set_quantity(val: number) {
  setting.quantityManager.set(String(val));
}

</script>

<template>
  <div class="welcome-page">
    <div class="welcome-card">
      <div class="welcome-header">
        <h1 class="welcome-title">口算练习</h1>
        <button class="btn-ghost welcome-mistakes-btn" type="button" @click="go_to_mistakes_collection">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
          错题本
        </button>
      </div>

      <form class="welcome-form" @submit.prevent="submit_form">
        <div class="form-field">
          <label class="form-label" for="category">类别</label>
          <select id="category" name="category" class="form-input" :value="setting.categoryId" @change="change_category">
            <option v-for="category in CATEGORIES" :value="category.id" :key="category.id">
              {{ category.desc }}
            </option>
          </select>
        </div>

        <div class="form-field">
          <label class="form-label" for="quantity">题数</label>
          <div class="form-field-row">
            <input id="quantity" name="quantity" type="number" required min="1" step="1" class="form-input flex-1"
              placeholder="练习题数..." :value="setting.quantity" @input="input_quantity" @change="change_quantity">
            <div class="quick-btns">
              <button type="button" class="quick-btn" :class="{ active: setting.quantity === 5 }" @click="set_quantity(5)">5</button>
              <button type="button" class="quick-btn" :class="{ active: setting.quantity === 10 }" @click="set_quantity(10)">10</button>
              <button type="button" class="quick-btn" :class="{ active: setting.quantity === 20 }" @click="set_quantity(20)">20</button>
            </div>
          </div>
        </div>

        <div class="form-field">
          <label class="form-label">避免重复题</label>
          <div class="toggle-switch" :class="{ on: setting.avoidRepeat }" @click="toggle_avoid_repeat">
            <div class="toggle-track">
              <div class="toggle-thumb"></div>
            </div>
            <span class="toggle-label">{{ setting.avoidRepeat ? '开启' : '关闭' }}</span>
          </div>
        </div>

        <div class="form-divider"></div>

        <ParamItem v-for="(config, i) in paramsConfig" :key="`${setting.categoryId}-${i}`" :i="i" :config="config"
          :default="setting.params.length > i ? setting.params[i] : undefined">
        </ParamItem>

        <div class="form-action">
          <button class="btn-primary" type="submit">开始练习</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.welcome-page {
  width: 100%;
  max-width: 420px;
}

.welcome-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.welcome-mistakes-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-text);
  margin: 0;
}

.welcome-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.welcome-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--c-text-secondary);
  min-width: 5.5rem;
  flex-shrink: 0;
}

.form-field-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-surface);
  color: var(--c-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

.form-input.flex-1 {
  flex: 1;
}

.form-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px var(--c-primary-light);
}

.quick-btns {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.quick-btn {
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  background: var(--c-bg);
  color: var(--c-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  line-height: 1;
}

.quick-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.quick-btn.active {
  border-color: var(--c-primary);
  background: var(--c-primary);
  color: #fff;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.toggle-track {
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  background: var(--c-border);
  border-radius: 0.625rem;
  transition: background 0.2s;
}

.toggle-thumb {
  position: absolute;
  top: 0.125rem;
  left: 0.125rem;
  width: 1rem;
  height: 1rem;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.toggle-switch.on .toggle-track {
  background: var(--c-primary);
}

.toggle-switch.on .toggle-track .toggle-thumb {
  transform: translateX(1rem);
}

.toggle-label {
  font-size: 0.8125rem;
  color: var(--c-text-secondary);
}

.form-divider {
  height: 1px;
  background: var(--c-border);
  margin: 0.25rem 0;
}

.form-action {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

@media (max-width: 480px) {
  .form-field {
    flex-direction: column;
    align-items: stretch;
    gap: 0.375rem;
  }

  .form-label {
    min-width: unset;
  }

  .form-field-row {
    flex-wrap: wrap;
  }

  .quick-btns {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
