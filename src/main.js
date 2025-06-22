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

// const rewriteCosHeaders = {
//   install(app) {
//     app.config.globalProperties.$cosPreview = (url) => {
//       return url.includes('cos.ap-shanghai') 
//         ? `${url}?response-content-disposition=inline` 
//         : url
//     }
//   }
// }

// app.use(rewriteCosHeaders)

app.mount('#app');

import { useCosStore } from './store/cosStore';

// 初始化
function initApp() {
  const cosStore = useCosStore();
  cosStore.initCredentials();
}
initApp()