import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'  // 添加重定向，访问根路径时跳转到/home
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/purchase/purchase.vue'),
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/category/category.vue'),
  },
  {
    path: '/goods',
    name: 'Goods',
    component: () => import('../views/goods/goods.vue'),
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: () => import('../views/goods/goodsDetail.vue'),
  },
  {
    path: '/historyBatches',
    name: 'HistoryBatches',
    component: () => import('../views/goods/historyBatches.vue'),
  },
  {
    path: '/orderList',
    name: 'OrderList',
    component: () => import('../views/order/orderList.vue'),
  },
  {
    path: '/orderDetail',
    name: 'OrderDetail',
    component: () => import('../views/order/orderDetail.vue'),
  },
  {
    path: '/orderLogs',
    name: 'OrderLogs',
    component: () => import('../views/order/orderLogs.vue'),
  },
  {
    path: '/configureSeller',
    name: 'ConfigureSeller',
    component: () => import('../views/configureSeller/configureSeller.vue'),
  },
  {
    path: '/comment',
    name: 'Comment',
    component: () => import('../views/comment/comment.vue'),
  },
  {
    path: '/notify',
    name: 'Notify',
    component: () => import('../views/notify/notify.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/admin.vue'),
  },
  {
    path: '/shipArea',
    name: 'ShipArea',
    component: () => import('../views/ship/shipArea.vue'),
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import('../views/recommend/recommend.vue'),
  },
  {
    path: '/newsList',
    name: 'NewsList',
    component: () => import('../views/news/newsList.vue'),
  },
  {
    path: '/newsDetail',
    name: 'NewsDetail',
    component: () => import('../views/news/newsDetail.vue'),
  },
  {
    path: '/systemLogs',
    name: 'SystemLogs',
    component: () => import('../views/systemLogs/systemLogs.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
