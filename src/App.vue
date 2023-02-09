<script lang="ts" setup>
import { RouterView } from 'vue-router';
import CustomizedFooter from './assets/components/CustomizedFooter.vue';
</script>

<template>
  <div class="text-center" id="root">
    <RouterView></RouterView>
    <CustomizedFooter remote-url="https://github.com/cup113/Oral-Calculation" version="0.4.2"
      license="MIT" years="2023" detailed></CustomizedFooter>
  </div>
</template>
