import { defineStore } from "pinia";
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 定义state - cartList
  const cartList = ref([]);

  const addCart = (goods) => {
    const item = cartList.value.find((item) => goods.productId === item.productId 
                                                      && goods.format === item.format);
    if(item) {
      item.count = item.count + goods.count;
    } else {
      cartList.value.push(goods);
    }
  }
  return {
    cartList,
    addCart
  }
},{
  persist: true
})