<script lang="ts" setup>
import useSettingStore from '@/store/setting';

defineProps<{
  remoteUrl: string,
  version: string,
  license: string,
  years: string,
  detailed: boolean,
}>();

const setting = useSettingStore();

const HOMEPAGE: string = "https://github.com/cup113";

function toggle_dark() {
  setting.darkModeManager.set(String(!setting.darkMode));
}
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-line">
        <span v-if="license">&copy; {{ years }} Jason Li</span>
        <span class="footer-dot">&middot;</span>
        <span>v{{ version }}</span>
        <span class="footer-dot">&middot;</span>
        <button class="btn-theme" @click="toggle_dark" :title="setting.darkMode ? '切换亮色模式' : '切换黑暗模式'">
          <svg v-if="setting.darkMode" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
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

<style>
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 0.8125rem;
  color: var(--c-text-muted);
}

.btn-theme {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem;
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s;
}
.btn-theme:hover {
  color: var(--c-text);
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
