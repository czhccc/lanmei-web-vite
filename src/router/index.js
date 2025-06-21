// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import { useMenuStore } from '../store/menu'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      component: () => import('../views/login/login.vue') 
    },
    {
      path: '/:pathMatch(.*)*',  // 404 路由，必须放最后
      name: 'NotFound',
      component: () => import('../views/error/404.vue'),
    }
  ]
})

export function setupDynamicRoutes(menuList) {
  const modules = import.meta.glob('/src/views/**/*.vue');
  
  // 添加动态路由
  menuList.forEach(item => {
    if (item.children?.length) {
      item.children.forEach(child => {
        addRoute(child);
      });
    } else if (item.path && item.component) {
      addRoute(item);
    }
  });
  
  // // 最后添加404路由
  // router.addRoute({
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/error/404.vue')
  // });
  
  function addRoute(routeItem) {
    const fullPath = `/src/views/${routeItem.component}`;
    const component = modules[fullPath];

    if (component) {
      router.addRoute({
        path: routeItem.path,
        name: routeItem.name || routeItem.path.replace(/\//g, '-'),
        component: component,
        meta: routeItem.meta || {}
      });
    } else {
      console.warn(`找不到组件: ${routeItem.path}`);
    }
  }
}

router.beforeEach(async (to, from, next) => {
  // 直接放行登录页
  if (to.path === '/login') {
    next();
    return;
  }

  const menuStore = useMenuStore();
  
  try {
    if (!menuStore.isMenuLoaded) { // 如果菜单未加载，先加载菜单
      await menuStore.loadMenuOnce();
      next(to.fullPath); // 菜单加载完成后，重新导航到当前路径
      return;
    }
    
    next(); // 菜单已加载，正常放行
  } catch (error) {
    // 错误处理：跳转到登录页
    console.error('路由守卫错误:', error);
    next('/login');
  }
});


export default router
