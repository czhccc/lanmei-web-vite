<template>
  <div class="Menu">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
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
  import { ref } from 'vue';
import { useRouter } from 'vue-router';

  const router = useRouter();

  const routesList = ref([
    {
      name: '首页（二期）',
      path: '/home',
    },
    {
      name: '采购管理（二期）',
      path: '/purchase',
    },
    {
      name: '商品',
      children: [
        {
          name: '分类管理',
          path: '/category',
        },
        {
          name: '商品管理',
          path: '/goods',
        },
      ]
    },
    {
      name: '订单',
      children: [
        {
          name: '订单管理',
          path: '/orderList',
        },
        {
          name: '订单日志',
          path: '/orderLogs',
        },
      ]
    },
    {
      name: '账号管理',
      path: '/configureSeller',
    },
    {
      name: '小程序',
      children: [
        {
          name: '首页商品推荐轮播',
          path: '/recommend',
        },
        {
          name: '首页资讯',
          path: '/newsList',
        },
        {
          name: '留言处理',
          path: '/comment',
        },
        {
          name: '首页通知',
          path: '/notify',
        },
        {
          name: '卖家信息',
          path: '/configureSeller',
        },
        {
          name: '可邮寄区域',
          path: '/shipArea',
        },
      ]
    },
  ])

  function changeRoute(path) {
    router.push(path)
  }

</script>

<style lang="less" scoped>
.Menu {
  height: 100%;
}
</style>