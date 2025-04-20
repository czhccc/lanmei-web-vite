import { defineStore } from 'pinia'
import { _getMenuList } from '../network/menu'

import { setupDynamicRoutes } from '../router/index'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
  }),
  
  actions: {
    async getMenuList() {
      try {
        const { data } = await _getMenuList()
        this.menuList = data.menu
        
        localStorage.setItem('menuList', JSON.stringify(data.menu))

        setupDynamicRoutes(data.menu)
      } catch (error) {
        console.error('菜单加载失败:', error)
      }
    },
    setMenuList(menuList) {
      this.menuList = menuList
    }
  }
})