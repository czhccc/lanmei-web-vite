import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';

import 'normalize.css'; // 引入 normalize.css

const app = createApp(App);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount('#app');