<template>
  <div class="Menu">
    <el-menu
      default-active="1-1"
      class="el-menu-vertical-demo"
    >
      <el-sub-menu index="1">
        <template #title>
          <span>父级菜单</span>
        </template>
        <el-menu-item index="1-1">子级菜单</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="3" @click="changeRoute('/home')">
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="4" @click="changeRoute('/purchase')">
        <span>采购</span>
      </el-menu-item>
      <el-menu-item index="5" @click="changeRoute('/configureSeller')">
        <span>配置卖家信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  function changeRoute(path) {
    router.push(path)
  }

</script>

<style lang="less" scoped>
.Menu {
  height: 100%;
}
</style>