import { createRouter, createWebHistory } from 'vue-router';
import home from '../views/home/home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: home
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../views/About.vue')
  // }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
