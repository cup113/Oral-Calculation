<script lang="ts" setup>
import { computed } from 'vue';

import type { Milliseconds } from '@/util';

const props = defineProps<{
  duration: Milliseconds
}>();

const
  totalSeconds = computed(() => props.duration / 1000),
  intPart = computed(() => Math.floor(totalSeconds.value)),
  fracPart = computed(() => '.' + String(Math.round(props.duration % 1000)).padStart(3, '0'));

</script>

<template>
  <span class="duration-text">
    <span class="dur-int">{{ intPart }}</span>
    <span class="dur-frac">{{ fracPart }}</span>
    <span class="dur-unit">″</span>
  </span>
</template>

<style>
.duration-text {
  font-variant-numeric: tabular-nums;
}

.dur-int {
  font-size: 1em;
  font-weight: 700;
}

.dur-frac {
  font-size: 0.6em;
  opacity: 0.5;
}

.dur-unit {
  font-size: 1em;
  font-weight: 400;
}
</style>
