<template>
  <div class="Menu">
    <el-menu
      ref="menuRef"
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :default-openeds="openKeys"
    >
      <template v-for="(item, index) in routesList" :key="index">
        <el-menu-item v-if="!item.children && item.path" :index="item.path" @click="changeRoute(item.path)" >
          <span>{{ item.name }}</span>
        </el-menu-item>
        
        <el-sub-menu v-if="item.children" :index="getMenuIndex(item, index)" >
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(child, childIndex) in item.children" :key="childIndex" :index="child.path" @click="changeRoute(child.path)" >
            <span>{{ child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '../../store/menu'

const route = useRoute();
const router = useRouter();
const menuRef = ref(null);
const hasOpened = ref(false);
const lastExpandTime = ref(0); // 记录上次展开时间

// 过滤菜单项
function filterMenu(menu) {
  return menu?.filter(item => !item.notInMenu)?.map(item => {
    const newItem = { ...item };
    if (newItem.children && newItem.children.length>0) {
      newItem.children = filterMenu(newItem.children);
    } else {
      delete newItem.children; // 确保没有子菜单的项不会被误判为有子菜单
    }
    return newItem;
  }) || [];
}

const routesList = computed(() => {
  const menuStore = useMenuStore()
  return filterMenu(menuStore.menuList)
})

// 获取安全的菜单索引
function getMenuIndex(item, index) {
  return item.path || `submenu-${item.name || 'unknown'}-${index}`;
}

// 计算需要展开的菜单项
const openKeys = computed(() => {
  if (routesList.value?.length) {
    return routesList.value.filter(item => item.children && item.children.length>0).map(item => getMenuIndex(item, 0));
  }
  return [];
});

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return route.path;
});

// 展开所有菜单项的函数（增强版）
function expandAllMenus() {
  // 避免频繁调用（5秒内只执行一次）
  const now = Date.now();
  if (now - lastExpandTime.value < 5000) return;
  lastExpandTime.value = now;
  
  // 重置展开状态
  hasOpened.value = false;
  
  nextTick(() => {
    let retryCount = 0;
    const maxRetries = 5;
    
    const tryExpand = () => {
      retryCount++;
      
      // 获取所有子菜单元素
      const submenuElements = menuRef.value?.$el?.querySelectorAll?.('.el-sub-menu');
      
      if (!submenuElements || submenuElements.length === 0) {
        if (retryCount < maxRetries) {
          setTimeout(tryExpand, 200 * retryCount);
        }
        return;
      }
      
      // 记录需要展开的菜单数量
      let needToExpand = 0;
      let expanded = 0;
      
      // 遍历每个子菜单
      submenuElements.forEach(submenuEl => {
        // 检查是否已经展开
        const isOpened = submenuEl.classList.contains('is-opened');
        if (isOpened) return;
        
        // 获取触发元素（标题）
        const triggerEl = submenuEl.querySelector('.el-sub-menu__title');
        if (!triggerEl) return;
        
        // 标记需要展开
        needToExpand++;
        
        // 创建并触发点击事件
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        
        // 添加事件监听确认展开完成
        const onSubmenuOpened = () => {
          expanded++;
          submenuEl.removeEventListener('transitionend', onSubmenuOpened);
          
          // 所有菜单都展开完成后标记
          if (expanded >= needToExpand) {
            hasOpened.value = true;
          }
        };
        
        // 监听展开动画完成
        submenuEl.addEventListener('transitionend', onSubmenuOpened);
        
        // 触发点击事件
        triggerEl.dispatchEvent(clickEvent);
      });
      
      // 如果没有需要展开的菜单，直接标记完成
      if (needToExpand === 0) {
        hasOpened.value = true;
      }
    };
    
    // 初始尝试
    tryExpand();
  });
}

// 监听路由列表变化
watch(routesList, (newList) => {
  if (newList?.length) {
    expandAllMenus();
  }
}, { immediate: true, deep: true });

// 监听路由变化（解决从登录页进入时的问题）
watch(() => route.path, (newPath) => {
  // 当路由变化到非登录页时，尝试展开菜单
  if (newPath !== '/login') {
    // 等待菜单数据加载完成
    setTimeout(expandAllMenus, 300);
  }
});

// 在组件挂载时也尝试一次
onMounted(() => {
  expandAllMenus();
});

function changeRoute(path) {
  if (path) {
    router.push(path);
  }
}
</script>

<style lang="less" scoped>
.Menu {
  height: 100%;
}
</style>