<script lang="ts" setup>
import type { ParamConfig } from '@/assets/question';
import { computed, ref } from 'vue';

const props = defineProps<{
  config: ParamConfig,
  i: number
}>();

const
  itemName = computed(() => `param-${props.i}`),
  itemTitle = computed(() => props.config.name + "..."),
  value = ref(props.config.default);

</script>

<template lang="pug">
div.row
  label.col-form-label(:for="itemName") {{ config.name }}
  span
    input.form-control(
      v-if="config.type === 'integer'"
      type="number"
      required="true"
      :id="itemName"
      :name="itemName"
      :step="1"
      :min="config.min"
      :max="config.max"
      :value="value"
      :placeholder="itemTitle"
    )
    select.form-control(
      v-else-if="config.type === 'select'"
      required="true"
      :id="itemName"
      :name="itemName"
      :value="value"
      :placeholder="itemTitle"
    )
      option(v-for="(choice, i) in config.choices" :value="i" :key="i") {{ choice }}
</template>

<style lang="scss">

</style>