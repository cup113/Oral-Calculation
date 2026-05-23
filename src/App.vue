<script lang="ts" setup>
import { watch } from 'vue';
import { RouterView } from 'vue-router';
import CustomizedFooter from './assets/components/CustomizedFooter.vue';
import useSettingStore from './store/setting';

const setting = useSettingStore();

watch(() => setting.darkMode, (val) => {
  document.documentElement.classList.toggle('dark', val);
}, { immediate: true });
</script>

<template>
  <div class="app-shell">
    <main class="app-main">
      <RouterView />
    </main>
    <CustomizedFooter remote-url="https://github.com/cup113/Oral-Calculation" version="0.6.1"
      license="MIT" years="2023-2026" detailed />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}
</style>
