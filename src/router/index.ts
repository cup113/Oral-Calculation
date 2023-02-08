import { createRouter, createWebHashHistory } from 'vue-router';

import WelcomeVue from '@/components/Welcome.vue';
import ExerciseVue from "@/components/Exercise.vue";
import ReportVue from '@/components/Report.vue';

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
      component: () => import('@/components/ReportShare.vue'),
    },
    {
      path: "/print-question",
      component: () => import('@/components/QuestionsPrint.vue'),
    },
    {
      path: "/mistakes-collection",
      component: () => import('@/components/MistakesCollection.vue'),
    },
    {
      path: "/:PathMatch(.*)", // 404
      redirect: "/"
    }
  ]
});
