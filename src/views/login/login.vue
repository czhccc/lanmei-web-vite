<template>
  <div class="login">
    <div class="color color1"></div>
    <div class="color color2"></div>
    <div class="color color3"></div>
    <div class="box" ref="box">
      <div class="square" style="--i: 0"></div>
      <div class="square" style="--i: 1"></div>
      <div class="square" style="--i: 2"></div>
      <div class="square" style="--i: 3"></div>
      <div class="square" style="--i: 4"></div>
      <div class="container">
        <div class="form">
          <h2>登录</h2>
          <form>
            <div class="inputBox">
              <input type="text" placeholder="请输入手机号" v-model="phone" />
            </div>
            <div class="inputBox">
              <input type="text" placeholder="请输入密码" v-model="password" />
            </div>
            <div class="inputBox">
              <div class="loginBtn" @click="login">登录</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

import {
  _login
} from '../../network/login'

const box = ref(null);
const resizeBox = () => {
  const vw = window.innerWidth / 1920;
  const vh = window.innerHeight / 1080;
  const scale = Math.min(vw, vh).toFixed(3); // 保持小数精度
  box.value.style.transform = `scale(${scale}) translate(-50%, -50%)`;
  box.value.style.transformOrigin = 'top left'; // 控制缩放中心
};

onMounted(() => {
  resizeBox();
  window.addEventListener('resize', resizeBox);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeBox);
});


let phone = ref('19967303498')
let password = ref('123456+')

import { useRouter } from 'vue-router';
const $router = useRouter();

function login() {
  if (!phone.value) {
    ElMessage({
      message: '请输入手机号',
      type: 'warning',
      plain: true,
    })
    return;
  }
  if (!password.value) {
    ElMessage({
      message: '请输入密码',
      type: 'warning',
      plain: true,
    })
    return;
  }

  _login({
    phone: phone.value,
    password: password.value,
  }).then(res => {
    $router.replace('/home')
  })
}

</script>

<style lang="less" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #f1f4f9, #dff1ff);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .color {
    position: absolute;
    filter: blur(8vw);
  }
  .color:nth-child(1) {
    left: 30%;
    top: 0%;
    width: 50%;
    height: 50%;
    background: #ff359b;
    border-radius: 50%;
  }
  .color:nth-child(2) {
    left: 0%;
    bottom: 10%;
    width: 50%;
    height: 50%;
    background: #fffd87;
    border-radius: 50%;
  }
  .color:nth-child(3) {
    bottom: 0%;
    right: 0%;
    width: 50%;
    height: 50%;
    background: #00d2ff;
    border-radius: 50%;
  }

  .box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .square {
      position: absolute;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.5);
      border-radius: 10px;
      animation: animate 10s linear infinite;
      animation-delay: calc(-1s * var(--i));
    }
    .square:nth-child(1) {
      top: -50px;
      right: -60px;
      width: 100px;
      height: 100px;
    }
    .square:nth-child(2) {
      top: 150px;
      left: -100px;
      width: 120px;
      height: 120px;
      z-index: 2;
    }
    .square:nth-child(3) {
      bottom: 50px;
      right: -60px;
      width: 80px;
      height: 80px;
      z-index: 2;
    }
    .square:nth-child(4) {
      bottom: -80px;
      left: 100px;
      width: 50px;
      height: 50px;
    }
    .square:nth-child(5) {
      top: -90px;
      left: 140px;
      width: 60px;
      height: 60px;
    }
    .container {
      position: relative;
      width: 600px;
      min-height: 500px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 60px;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-right: 1px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      .form {
        position: relative;
        height: 100%;
        width: 100%;
        padding: 40px;
        h2 {
          position: relative;
          color: #fff;
          font-size: 40px;
          font-weight: 700;
          letter-spacing: 20px;
          margin-bottom: 60px;
        }
        h2::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 100px;
          height: 4px;
          background: #fff;
        }
        .inputBox {
          width: 100%;
          margin-top: 30px;
        }
        .inputBox input {
          width: 100%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          outline: none;
          padding: 20px 30px;
          box-sizing: border-box;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 28px;
          letter-spacing: 1px;
          color: black;
          font-weight: 700;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        .inputBox input:focus {
          background: rgba(255, 255, 255, 0.6);
        }
        .loginBtn {
          background: #fff;
          color: black;
          width: 100%;
          cursor: pointer;
          margin-bottom: 20px;
          font-weight: 700;
          box-sizing: border-box;
          padding: 20px 30px;
          border-radius: 40px;
          text-align: center;
          font-size: 28px;
          letter-spacing: 10px;
        }
        .loginBtn:hover {
          background: #1989FA;
          color: white;
        }
        .inputBox input::placeholder {
          color: black;
          font-weight: 700;
          font-size: 28px;
        }
      }
    }
  }

  @keyframes animate {
    0%, 100% {
      transform: translateY(-40px);
    }
    50% {
      transform: translateY(40px);
    }
  }
}
</style>