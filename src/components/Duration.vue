<script lang="ts" setup>
import { computed } from 'vue';

import type { Milliseconds } from '@/assets/question';

const props = defineProps<{
  duration: Milliseconds
}>();

const
  seconds = computed(() => Math.floor(props.duration / 1000)),
  milliseconds = computed(() => props.duration % 1000),
  millisecondsDisplay = computed(() => {
    let res = milliseconds.value.toFixed(0);
    if (seconds.value > 0) {
      let l = 3 - res.length;
      res = new Array(l > 0 ? l : 0).fill("0").join("") + res;
    }
    return res;
  });

</script>

<template lang="pug">
span.duration
  template(v-if="seconds == 0")
    span.text-sm {{ millisecondsDisplay }}毫秒
  template(v-else)
    span(v-if="seconds > 0") {{ seconds }}秒
    span.text-xs.opacity-75 {{ millisecondsDisplay }}毫秒
</template>
