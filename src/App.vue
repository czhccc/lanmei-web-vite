<template>
  <div class="app">
    <!-- 主布局 -->
    <el-container class="app-wrapper" v-if="!isLogin">
      <el-header class="app-header">
        <Header />
      </el-header>
      <el-container class="app-container">
        <el-aside class="app-aside">
          <Menu />
        </el-aside>
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    
    <!-- 登录页布局 -->
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header/Header.vue';
import Menu from './components/Menu/Menu.vue';

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLogin = ref(route.path === '/login');

// 监听路由变化
watch(() => route.path, (newPath) => {
  isLogin.value = newPath === '/login';
});
</script>

<style lang="less">
.app {
  height: 100vh;
  .app-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    .app-header {
      height: 50px;
      padding: 0;
      box-sizing: border-box;
    }
    .app-container {
      flex: 1;
      display: flex;
      .app-aside {
        width: 200px;
        box-sizing: border-box;
      }
      .app-main {
        flex: 1;
        padding: 20px;
        box-sizing: border-box;
        height: calc(100vh - 50px);
        overflow-y: auto;

        input:disabled::placeholder,
        textarea:disabled::placeholder,
        select:disabled::placeholder {
          color: transparent;
        }

      }
    }
  }
}
</style>
