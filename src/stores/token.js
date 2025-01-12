// 定义store
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useTokenStore = defineStore('token',()=>{

  const token = ref('');

  // 定义函数修改token 的值
  const setToken = (newToken)=>{
    token.value = newToken;
  }

  const removeToken = ()=>{
    token.value='';
  }

  return {
    token, setToken, removeToken
  }
},{
  persist: true // 持久化存储
});

