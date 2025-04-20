// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

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
      name: '登录页',
      component: () => import('../views/login/login.vue') 
    }
  ]
})

export function setupDynamicRoutes(menuList) {
  const modules = import.meta.glob('/src/views/**/*.vue')

  const addRoutes = (menus) => {
    menus.forEach(item => {
      if (item.children && item.children.length > 0) {
        addRoutes(item.children)
      } else if (item.path && item.component) {
        const fullPath = `/src/views/${item.component}`
        const component = modules[fullPath]

        if (component) {
          router.addRoute({
            path: item.path,
            name: item.name || item.path,
            component: component,
          })
        } else {
          console.warn('找不到组件路径：', fullPath)
        }
      }
    })
  }

  addRoutes(menuList)
}


export default router
