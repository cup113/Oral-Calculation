<script lang="ts" setup>
import type { ParamConfig } from '@/question';
import { computed } from 'vue';

const props = defineProps<{
  config: ParamConfig,
  i: number,
  default?: string,
}>();

const
  itemName = computed(() => `param-${props.i}`),
  itemTitle = computed(() => props.config.name + "..."),
  value = computed(() => props.default ?? props.config.default);

</script>

<template>
  <div class="param-item">
    <label class="col-form-label" :for="itemName">{{ config.name }}</label>
    <span>
      <input
        v-if="config.type === 'integer'"
        type="number"
        required="true"
        :id="itemName"
        :name="itemName"
        :step="1"
        :min="config.min"
        :max="config.max"
        :value="value"
        :placeholder="itemTitle">
      <select
        v-else-if="config.type === 'select'"
        required="true"
        :id="itemName"
        :name="itemName"
        :value="value"
        :placeholder="itemTitle">
        <option
          v-for="(choice, i) in config.choices"
          :value="i"
          :key="i">{{ choice }}</option>
      </select>
    </span>
  </div>
</template>
