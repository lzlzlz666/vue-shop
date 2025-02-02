import axios from 'axios';
import { useRouter } from 'vue-router';

// 创建 Axios 实例
const http = axios.create({
  baseURL: '/api', // 设置基础 URL
  timeout: 10000, // 设置请求超时时间
});

// 创建 router 实例
const router = useRouter();

import { useTokenStore } from '@/stores/token.js'
// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头或其他配置
    const tokenStore = useTokenStore();
    if(tokenStore.token){
      config.headers.Authorization = tokenStore.token
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 处理响应数据
    if (response.data.code !== 0) {
      // 如果返回的 code 不是 0，抛出错误
      return Promise.reject(new Error(response.data.message));
    }
    return response.data.data; // 返回数据部分
  },
  (error) => {
    // 处理响应错误
    console.error('响应错误:', error);
    // 判断是否是 token 过期的错误（通常是 401 状态码）
    if (error.response && error.response.status === 401) {
      const tokenStore = useTokenStore();
      tokenStore.removeToken(); // 清除 token
      // 跳转到登录页面（你可以根据自己的路由方式调整）
      router.push('/login'); // 如果你使用 Vue Router
    }

    return Promise.reject(error);
  }
);

export default http; 