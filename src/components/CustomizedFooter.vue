<script lang="ts" setup>
defineProps<{
  remoteUrl: string,
  version: string,
  license: string,
  years: string,
  detailed: boolean,
}>();

const HOMEPAGE: string = "https://github.com/cup113";
</script>

<template>
  <div class="customized-footer absolute bg-gray-50 w-full leading-6 py-4 bottom-0">
    <div v-if="license.length > 0">
      <span>&copy; {{ years }}&nbsp;</span>
      <template v-if="detailed">
        <span>Jason Li</span>
        <a class="badge bg-gray-600" target="_blank"
          :href="`https://spdx.org/licenses/${license}.html`">
          {{ license }} licensed
        </a>
      </template>
      <template v-else>
        <span>&copy; {{ years }} Jason Li. All Rights Reserved.</span>
      </template>
    </div>
    <div>Version:&nbsp;<span>{{ version }}</span></div>
    <div v-if="detailed">
      <a class="badge bg-blue-500" target="_blank" :href="HOMEPAGE">关于开发者</a>
      <a class="badge bg-blue-500" target="_blank" :href="remoteUrl + '/issues'">问题报告</a>
      <a class="badge bg-blue-500" target="_blank" :href="remoteUrl">开源</a>
    </div>
    <div>
      <a class="badge bg-blue-500" target="_blank" href="README.html">使用说明</a>
      <a class="badge bg-blue-500" target="_blank" href="copyrights.txt">版权声明</a>
      <a class="badge bg-blue-500" target="_blank" href="CHANGELOG.html">更新日志</a>
    </div>
  </div>
</template>

<style lang="scss">
$height: 8rem;
$gap: 2rem;

#root {
  position: relative;
  min-height: 100vh;
  padding-bottom: $height + $gap;
}

.customized-footer {
  height: $height;
}
</style>
