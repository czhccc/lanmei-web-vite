// store/menuStore.js
import { defineStore } from 'pinia'
import { _getMenuList } from '../network/menu'
import { setupDynamicRoutes } from '../router/index'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
    isMenuLoaded: false,  // 用于防止重复加载
  }),

  actions: {
    async loadMenuOnce() {
      if (this.isMenuLoaded) return;

      try {
        const { data } = await _getMenuList();
        this.menuList = data.menu || [];
        this.isMenuLoaded = true;
        
        setupDynamicRoutes(this.menuList);
      } catch (error) {
        console.error('菜单加载失败:', error);
        throw error;
      }
    }
  }
})
