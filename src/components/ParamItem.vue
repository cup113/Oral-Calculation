<script lang="ts" setup>
import type { ParamConfig } from '@/question';
import { computed } from 'vue';

import useSettingStore from '@/store/setting';

const
  setting = useSettingStore();

const props = defineProps<{
  config: ParamConfig,
  i: number,
  default?: string,
}>();

const
  itemName = computed(() => `param-${props.i}`),
  itemTitle = computed(() => props.config.name + "..."),
  value = computed(() => {
    const v = props.default;
    return (v !== undefined && v !== '') ? v : String(props.config.default);
  });

const isDigitParam = computed(() =>
  props.config.type === 'integer' && props.config.name.includes("位数")
);

function set_digit(val: number) {
  const newParams = [...setting.params];
  newParams[props.i] = String(val);
  setting.paramsManager.set(newParams.join(setting.PARAMS_SEP));
}

function input_digit(ev: Event) {
  let val = (ev.target as HTMLInputElement).value;
  if (/^\d+$/.test(val) && parseInt(val) >= 1) {
    const newParams = [...setting.params];
    newParams[props.i] = val;
    setting.paramsManager.set(newParams.join(setting.PARAMS_SEP));
  }
}

function set_select(val: string) {
  const newParams = [...setting.params];
  newParams[props.i] = val;
  setting.paramsManager.set(newParams.join(setting.PARAMS_SEP));
}

function set_boolean(val: string) {
  const newParams = [...setting.params];
  newParams[props.i] = val;
  setting.paramsManager.set(newParams.join(setting.PARAMS_SEP));
}

</script>

<template>
  <div class="form-field">
    <label class="form-label" :for="itemName">{{ config.name }}</label>

    <template v-if="config.type === 'integer'">
      <div class="form-field-row">
        <input
          type="number"
          required
          :id="itemName"
          :name="itemName"
          step="1"
          :min="config.min"
          :max="config.max"
          :value="value"
          class="form-input flex-1"
          :placeholder="itemTitle"
          @input="input_digit">
        <div class="quick-btns" v-if="isDigitParam">
          <button type="button" class="quick-btn" :class="{ active: value === '1' }" @click="set_digit(1)">1</button>
          <button type="button" class="quick-btn" :class="{ active: value === '2' }" @click="set_digit(2)">2</button>
          <button type="button" class="quick-btn" :class="{ active: value === '3' }" @click="set_digit(3)">3</button>
          <button type="button" class="quick-btn" :class="{ active: value === '4' }" @click="set_digit(4)">4</button>
        </div>
      </div>
    </template>

    <select
      v-else-if="config.type === 'select'"
      required
      :id="itemName"
      :name="itemName"
      class="form-input"
      :value="value"
      @change="set_select(($event.target as HTMLSelectElement).value)">
      <option
        v-for="(choice, i) in config.choices"
        :value="i"
        :key="i">{{ choice }}</option>
    </select>

    <div v-else-if="config.type === 'boolean'" class="toggle-switch" :class="{ on: value === '1' }" @click="set_boolean(value === '1' ? '0' : '1')">
      <input type="hidden" :name="itemName" :value="value">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
      <span class="toggle-label">{{ value === '1' ? '开启' : '关闭' }}</span>
    </div>
  </div>
</template>

<style scoped>
.form-field-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
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

@media (max-width: 480px) {
  .form-field {
    flex-direction: column;
    align-items: stretch;
    gap: 0.375rem;
  }
}
</style>
