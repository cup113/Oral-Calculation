import { createRouter, createWebHashHistory } from 'vue-router';

import WelcomeVue from '@/components/Welcome.vue';
import ExerciseVue from "@/components/Exercise.vue";
import ReportVue from '@/components/Report.vue';
import ReportShareVue from '@/components/ReportShare.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/welcome",
    },
    {
      path: "/welcome",
      component: WelcomeVue,
    },
    {
      path: "/exercise/:category/:params/:quantity",
      component: ExerciseVue,
      props: true,
    },
    {
      path: "/report",
      component: ReportVue,
    },
    {
      path: "/report-share",
      component: ReportShareVue,
    },
    {
      path: "/print-question",
      component: () => import('@/components/QuestionsPrint.vue'),
    },
    {
      path: "/:PathMatch(.*)", // 404
      redirect: "/"
    }
  ]
});
