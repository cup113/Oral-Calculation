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
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-line">
        <span v-if="license">&copy; {{ years }} Jason Li</span>
        <span class="footer-dot">&middot;</span>
        <span>v{{ version }}</span>
      </div>
      <div v-if="detailed" class="footer-links">
        <a class="badge" target="_blank" :href="HOMEPAGE">关于</a>
        <a class="badge" target="_blank" href="https://f.kdocs.cn/g/iuGauWIo/">反馈</a>
        <a class="badge" target="_blank" :href="remoteUrl">源码</a>
        <a class="badge" target="_blank" href="README.html">说明</a>
        <a class="badge" target="_blank" href="CHANGELOG.html">更新</a>
        <a class="badge" target="_blank" :href="`https://spdx.org/licenses/${license}.html`">
          {{ license }}
        </a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  margin-top: auto;
  padding: 1.5rem 1rem;
  text-align: center;
  border-top: 1px solid var(--c-border);
}

.footer-inner {
  max-width: 640px;
  margin: 0 auto;
}

.footer-line {
  font-size: 0.8125rem;
  color: var(--c-text-muted);
}

.footer-dot {
  margin: 0 0.375rem;
}

.footer-links {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
}
</style>
