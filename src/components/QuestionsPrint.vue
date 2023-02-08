<script lang="ts" setup>

</script>

<template>
  <div class="questions-print absolute w-full h-full bg-white overflow-auto">
    <div class="buttons">
      <span class="btn bg-green-500">打印题目</span>
      <span class="btn bg-green-500">打印答案</span>
    </div>
    <div>
      <span>1</span>
    </div>
  </div>
</template>

<style lang="scss">
.bg-white {
  z-index: 1;
}

@media print {
  @page {
    size: 210mm 297mm portrait;
  }

  .buttons {
    display: none;
  }
}
</style>
