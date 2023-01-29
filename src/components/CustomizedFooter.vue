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

<template lang="pug">
div.customized-footer
  div(v-if="license.length > 0")
    span &copy; {{ years }}&nbsp;
    template(v-if="detailed")
      span Jason Li
      a.badge.text-bg-secondary(
        target="_blank"
        :href="`https://spdx.org/licenses/${license}.html`"
      ) {{ license }} licensed
    template(v-else)
      span &copy; {{ years }} Jason Li. All Rights Reserved.
  div
    | Version:&nbsp;
    span {{ version }}
  div(v-if="detailed")
    a.badge.text-bg-primary(target="_blank" :href="HOMEPAGE") 关于开发者
    a.badge.text-bg-primary(target="_blank" :href="remoteUrl + '/issues'") 问题报告
    a.badge.text-bg-primary(target="_blank" :href="remoteUrl") 开源
  div
    a.badge.text-bg-primary(target="_blank" href="readme.html") 使用说明
    a.badge.text-bg-primary(target="_blank" href="copyrights.txt") 版权声明
    a.badge.text-bg-primary(target="_blank" href="CHANGELOG.html") 更新日志
</template>

<style lang="scss">
@import "bootstrap/scss/_functions.scss";

@import "bootstrap/scss/_variables.scss";
@import "bootstrap/scss/_mixins.scss";

@import 'bootstrap/scss/helpers/_color-bg.scss';
@import 'bootstrap/scss/_badge.scss';

$height: 8em;
$gap: 2em;

#root {
  position: relative;
  min-height: calc(100vh);
  padding-bottom: $height + $gap;
}

.customized-footer {
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  line-height: 1.5;
  height: $height;
  padding: 1em 0;
  background-color: $light;

  a {
    margin: 0 0.25em;
    text-decoration: none;
  }
}
</style>