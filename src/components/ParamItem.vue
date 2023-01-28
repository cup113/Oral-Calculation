<script lang="ts" setup>
import type { ParamConfig } from '@/assets/question';
import { computed } from 'vue';

const props = defineProps<{
  config: ParamConfig,
  i: number
}>();

const
  itemName = computed(() => `param-${props.i}`),
  itemTitle = computed(() => props.config.name + "...");
</script>

<template lang="pug">
div.row
  label.col-form-label(:for="itemName") {{ config.name }}
  span
    input.form-control(
      v-if="config.choices === undefined"
      type="number"
      required="true"
      :id="itemName"
      :name="itemName"
      :min="config.min"
      :step="1"
      :max="config.max"
      :placeholder="itemTitle"
    )
    select.form-control(v-else :name="itemName" :placeholder="itemTitle" required="true")
      option(v-for="(choice, i) in config.choices" :value="i" :key="i") {{ choice }}
</template>

<style lang="scss">

</style>