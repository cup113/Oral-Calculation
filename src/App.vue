<script lang="ts" setup>
import { RouterView } from 'vue-router';
import CustomizedFooter from './components/CustomizedFooter.vue';
</script>

<template lang="pug">
div#root.text-center
  RouterView
  CustomizedFooter(
    remote-url="https://github.com/cup113/Oral-Calculation"
    version="0.1.4-alpha.0"
    license="MIT"
    years="2023"
    detailed
  )
</template>
