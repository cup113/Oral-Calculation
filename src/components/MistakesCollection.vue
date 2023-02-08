<script lang="ts" setup>
import { useRouter } from 'vue-router';
import Message from 'vue-m-message';
import JsFileDownloader from 'js-file-downloader';

import useMistakesStore from '@/store/mistakes';

const router = useRouter();

const { get_mistakes, clear_mistakes } = useMistakesStore();

const mistakes = get_mistakes();

function go_to_main_page() {
  router.push("/");
}

function clear_all() {
  if (confirm("确认要清空错题本吗？这会丢失所有错题数据。")) {
    clear_mistakes();
    go_to_main_page();
  }
}

function export_all() {
  let fileUrl = URL.createObjectURL(new Blob([JSON.stringify(mistakes, undefined, 2)]));
  new JsFileDownloader({
    url: fileUrl,
    autoStart: true,
    contentType: "Application/json",
    filename: `oral-calculation-mistakes-${(new Date()).getTime()}.json`,
  }).then(() => {
    URL.revokeObjectURL(fileUrl);
  }, reason => {
    URL.revokeObjectURL(fileUrl);
    Message.warning("导出失败: " + (reason ?? "未知原因").toString());
  });
  Message.info("正在导出中……请等待……", {
    duration: 10000,
  });
}

</script>

<template>
  <div class="mistakes-collection py-4 md:px-8">
    <h2 class="text-2xl font-bold">我的错题本</h2>
    <table class="mx-auto my-8">
      <thead>
        <tr>
          <th>编号</th>
          <th class="hidden md:table-cell">时间</th>
          <th>问题</th>
          <th>用时</th>
          <th>标答</th>
          <th>错误回答</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mistake, i) in mistakes" :key="i">
          <td>{{ i + 1 }}</td>
          <td class="hidden md:table-cell">{{ mistake.time }}</td>
          <td>{{ mistake.problem }}</td>
          <td>{{ (mistake.duration / 1000).toFixed(3) }}秒</td>
          <td class="text-green-700">{{ mistake.correctAnswer }}</td>
          <td class="text-red-700">{{ mistake.wrongAnswers.join(",") }}</td>
        </tr>
      </tbody>
    </table>
    <div>
      <button type="button" class="btn bg-gray-500 mb-4 mr-4" @click="go_to_main_page">返回主页</button>
      <button type="button" class="btn bg-blue-500 mb-4" @click="export_all">导出记录</button>
    </div>
    <div>
      <button type="button" class="btn bg-red-500" @click="clear_all">清空错题本</button>
    </div>
  </div>
</template>

<style lang="scss">
.mistakes-collection {
  th,
  td {
    @apply border-2 border-dashed border-black p-1;
  }
}
</style>
