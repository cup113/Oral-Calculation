<script lang="ts" setup>
import CustomizedFooter from './components/CustomizedFooter.vue';
</script>

<template lang="pug">
div#root
  RouterView
  CustomizedFooter(
    remote-url="https://github.com/cup113/Oral-Calculation"
    version="0.1.0-alpha.1"
    license="MIT"
    years="2023"
    detailed
  )
</template>

<style lang="scss">
@import '@/assets/style/normalize.scss';

#root {
  text-align: center;
  h2 {
    padding: 1em 0;
  }
}
</style>