import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';
import Message from 'vue-m-message';

import router from '@/router/index.ts';

import 'vue-m-message/dist/style.css';

Message.setDefault({
  closable: true,
})

const app = createApp(App);
app.use(createPinia());
app.use(Message);
app.use(router);

app.mount('#app');
