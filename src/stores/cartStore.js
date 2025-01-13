import { defineStore } from "pinia";
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 定义state - cartList
  const cartList = ref([]);

  const addCart = (goods) => {
    console.log("Adding goods:", goods);  // 打印传入的商品对象，确认 goods.count 是否正确
    const item = cartList.value.find((item) => goods.productId === item.productId)
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