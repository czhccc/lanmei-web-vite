import axios from 'axios';
import Cookies from 'js-cookie';
import { ElLoading, ElMessage } from 'element-plus'; // 使用 Element Plus 的 Loading 和 Message
import router from '@/router'; // 根据需要引入路由

// 创建一个axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,  // 设置基础地址
  timeout: 5000,  // 请求超时时间
});

// 添加一个全局 loading 实例
let loadingInstance = null;

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请求开始时，显示 Loading
    loadingInstance = ElLoading.service({text: '加载中...'})

    // 自动携带 token（假设 token 存储在 localStorage 中）
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 根据实际需要调整 token 的携带方式
    }

    return config;
  },
  error => {
    // 关闭 Loading 并抛出错误
    if (loadingInstance) loadingInstance.close();
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 关闭 Loading
    if (loadingInstance) loadingInstance.close();

    const res = response.data;
    
    if (res.code === 200) {
      return res;
    } else {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        plain: true
      });

      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  error => {
    console.log('响应拦截器', error);
    // 关闭 Loading
    if (loadingInstance) loadingInstance.close();

    if (error.response.data.code === 401) {
      router.replace('/login');
    }

    // 错误处理
    ElMessage({
      message: error.response.data.message || error.message || '请求出现错误',
      type: 'error',
      plain: true
    });

    return Promise.reject(error);
  }
);

export default service;
