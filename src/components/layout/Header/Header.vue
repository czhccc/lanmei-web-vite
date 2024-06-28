<template>
  <div class="Header">
    <div class="left">后台管理平台</div>
    <div class="middle"></div>
    <div class="right">
      <div class="name">superadmin</div>
      <div class="loginOut" @click="loginOut">
        <el-icon class="loginOut"><i-ep-SwitchButton class="loginOut" /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function loginOut() {
  ElMessageBox.confirm(
    '确认退出账号?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    router.replace('/login')
  })
}

</script>

<style lang="less" scoped>
.Header {
  background-color: #1989FA;
  display: flex;
  justify-content: space-between;
  height: 50px;
  .left {
    font-size: 30px;
    color: white;
    font-weight: 700;
    line-height: 50px;
    padding-left: 20px;
  }
  .middle {
    flex: 1;
  }
  .right {
    width: 200px;
    line-height: 50px;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    .name {
      color: white;
      font-size: 16px;
      margin-right: 20px;
    }
    .loginOut {
      color: white;
      cursor: pointer;
    }
  }
}
</style>