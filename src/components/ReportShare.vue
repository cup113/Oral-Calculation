<script lang="ts" setup>
import { ref } from 'vue';

import useQuestionStore from '@/store/question';

const { questions, questionProvider } = useQuestionStore();

const title = questionProvider.get_title();
const generatedDisplay = (new Date()).toLocaleString();

</script>

<template lang="pug">
div.report-share.fixed.w-full.h-full.bg-white
  div.w-80.h-96.mx-auto
    div.bg-gray-100.my-4.text-left.pl-4
      div 口算练习 {{ title }}
      div.text-gray-700 {{ generatedDisplay }}
    div.bg-gray-100
      span 1
</template>

<style lang="scss">
.report-share {
  z-index: 1;
}
</style>
