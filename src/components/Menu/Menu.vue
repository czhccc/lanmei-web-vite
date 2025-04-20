<template>
  <div class="Menu">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :default-openeds="openKeys"
    >
      <template v-for="(item, index) in routesList" :key="index">
        <el-menu-item v-if="!item.children" :index="item.name" @click="changeRoute(item.path)">
          <span>{{ item.name }}</span>
        </el-menu-item>
        <el-sub-menu v-if="item.children" :index="item.name">
          <template #title>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(iten, indey) in item.children" :key="indey" :index="iten.name" @click="changeRoute(iten.path)">
            <span>{{ iten.name }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

import { useRouter } from 'vue-router';

import { useMenuStore } from '../../store/menu'

const menuStore = useMenuStore()

const router = useRouter();

function filterMenu(menu) {
  return menu
    .filter(item => !item.notInMenu)
    .map(item => {
      const newItem = { ...item };
      if (newItem.children) {
        newItem.children = filterMenu(newItem.children);
      }
      return newItem;
    });
}

const routesList = computed(() => {
  return filterMenu(menuStore.menuList)
})

const openKeys = computed(() => {
  if (routesList.value) {
    return routesList.value
      .filter(item => item.children)
      .map(item => item.name);
  } else {
    return []
  }
});

function changeRoute(path) {
  router.push(path)
}

</script>

<style lang="less" scoped>
.Menu {
  height: 100%;
}
</style>