<script lang="ts" setup>
import { computed } from 'vue';

import type { Milliseconds } from '@/assets/util';
import { empty_array } from '@/assets/util';

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
      res = empty_array(Math.max(l, 0)).join("") + res;
    }
    return res;
  });

</script>

<template lang="pug">
span.duration
  template(v-if="seconds == 0")
    span.text-sm {{ millisecondsDisplay }}毫秒
  template(v-else)
    span {{ seconds }}秒
    span.text-xs.opacity-75 {{ millisecondsDisplay }}毫秒
</template>
