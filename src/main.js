// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router, { setupDynamicRoutes } from './router/index';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';

import 'normalize.css'; // 引入 normalize.css
import './assets/css/scrollBar.css'; // 全局滚动条样式

import { createPinia } from 'pinia';

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.use(ElementPlus, {
  locale: zhCn,
});
app.mount('#app');