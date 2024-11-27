<template>
  <div class="Menu">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
    >
      <el-menu-item index="1" @click="changeRoute('/home')">
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2" @click="changeRoute('/purchase')">
        <span>采购管理</span>
      </el-menu-item>
      <el-menu-item index="3" @click="changeRoute('/category')">
        <span>分类管理</span>
      </el-menu-item>
      <el-menu-item index="4" @click="changeRoute('/goods')">
        <span>商品管理</span>
      </el-menu-item>
      <el-menu-item index="5" @click="changeRoute('/orderList')">
        <span>订单管理</span>
      </el-menu-item>
      <el-menu-item index="6" @click="changeRoute('/orderLogs')">
        <span>订单日志</span>
      </el-menu-item>
      <el-menu-item index="7" @click="changeRoute('/comment')">
        <span>处理留言</span>
      </el-menu-item>
      <el-menu-item index="8" @click="changeRoute('/notify')">
        <span>首页通知</span>
      </el-menu-item>
      <el-menu-item index="8" @click="changeRoute('/configureSeller')">
        <span>卖家信息</span>
      </el-menu-item>
      <el-menu-item index="9" @click="changeRoute('/account')">
        <span>账号管理</span>
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