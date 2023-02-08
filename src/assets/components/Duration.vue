<script lang="ts" setup>
import { computed } from 'vue';

import type { Milliseconds } from '@/util';
import { empty_array } from '@/util';

const props = defineProps<{
  duration: Milliseconds
}>();

const
  seconds = computed(() => Math.floor(props.duration / 1000)),
  milliseconds = computed(() => props.duration % 1000),
  millisecondsDisplay = computed(() => {
    let res = milliseconds.value.toFixed(0);
    if (seconds.value > 0)
      res = res.padStart(3, '0');
    return res;
  });

</script>

<template>
  <span class="duration">
    <template v-if="seconds == 0">
      <span class="text-sm">{{ millisecondsDisplay }}毫秒</span>
    </template>
    <template v-else>
      <span>{{ seconds }}秒</span>
      <span class="text-xs opacity-75">{{ millisecondsDisplay }}毫秒</span>
    </template>
  </span>
</template>
