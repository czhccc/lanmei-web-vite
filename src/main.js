import { createApp } from 'vue';
import App from './App.vue';
import router, { setupDynamicRoutes } from './router/index';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css';

import 'normalize.css'; // 引入 normalize.css
import './assets/css/scrollBar.css'; // 全局滚动条样式

import { createPinia } from 'pinia';
import { useMenuStore } from './store/menu';

const app = createApp(App);

app.use(createPinia());

// ✅ 如果有本地菜单缓存，重新加载动态路由
const menuCache = localStorage.getItem('menuList')
if (menuCache) {
  const menuList = JSON.parse(menuCache)
  setupDynamicRoutes(menuList)

  // ✅ 设置到 Pinia 中（确保 useMenuStore 在 app.use(pinia) 之后调用）
  const menuStore = useMenuStore()
  menuStore.setMenuList(menuList)
}

app.use(router);

app.use(ElementPlus, {
  locale: zhCn,
});
app.mount('#app');