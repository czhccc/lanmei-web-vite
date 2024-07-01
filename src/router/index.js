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
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/purchase/purchase.vue'),
  },

  {
    path: '/configureSeller',
    name: 'ConfigureSeller',
    component: () => import('../views/configureSeller/configureSeller.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
