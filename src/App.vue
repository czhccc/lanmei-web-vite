<template>
  <div class="app">
    <el-container class="wrapper">
      <el-header class="header">
        <Header />
      </el-header>
      <el-container class="container">
        <el-aside class="aside">
          <Menu />
        </el-aside>
        <el-main class="main">
          Main
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
  import Header from './components/layout/Header/Header.vue';
  import Menu from './components/layout/Menu/Menu.vue';

</script>

<style lang="less" scoped>
.app {
  height: 100vh;
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    .header {
      height: 100px;
      background-color: aqua;
      padding: 0;
    }
    .container {
      flex: 1;
      display: flex;
      .aside {
        width: 200px;
        background-color: orange;
        padding: 20px;
        box-sizing: border-box;
      }
      .main {
        flex: 1;
        background-color: pink;
        padding: 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
