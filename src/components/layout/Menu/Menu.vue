<template>
  <div class="Menu">
    <el-menu
      default-active="3"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="3" @click="changeRoute('/home')">
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="4" @click="changeRoute('/purchase')">
        <span>采购</span>
      </el-menu-item>
      <el-menu-item index="5" @click="changeRoute('/configureSeller')">
        <span>配置卖家信息</span>
      </el-menu-item>
      <el-menu-item index="6" @click="changeRoute('/account')">
        <span>账号管理</span>
      </el-menu-item>
      <!-- <el-sub-menu index="10">
        <template #title>
          <span>系统管理</span>
        </template>
        <el-menu-item index="10-1">账号管理</el-menu-item>
      </el-sub-menu> -->
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