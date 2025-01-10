import axios from 'axios';

// 创建 Axios 实例
const http = axios.create({
  baseURL: '/api', // 设置基础 URL
  timeout: 10000, // 设置请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头或其他配置
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
    return Promise.reject(error);
  }
);

export default http; 