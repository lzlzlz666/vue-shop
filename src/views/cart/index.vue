<template>
  <div>
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main>
        <div class="cart-container">
          <h2 class="cart-title">购物车</h2>
          
          <!-- 购物车为空时显示 -->
          <el-empty v-if="cartItems.length === 0" description="购物车是空的">
            <el-button type="primary" @click="$router.push('/products')">去购物</el-button>
          </el-empty>

          <!-- 购物车列表 -->
          <template v-else>
            <el-table :data="cartItems" style="width: 100%">
              <!-- 选择框 -->
              <el-table-column width="55">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.selected" @change="updateTotal" />
                </template>
              </el-table-column>

              <!-- 商品信息 -->
              <el-table-column label="商品信息">
                <template #default="scope">
                  <div class="product-info">
                    <img :src="scope.row.picture" :alt="scope.row.name">
                    <div class="product-details">
                      <h3>{{ scope.row.name }}</h3>
                      <p class="specs">{{ scope.row.format }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <!-- 单价 -->
              <el-table-column label="单价" width="120">
                <template #default="scope">
                  <span class="price">¥{{ scope.row.price }}</span>
                </template>
              </el-table-column>

              <!-- 数量 -->
              <el-table-column label="数量" width="200">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.count" 
                    :min="1" 
                    :max="99"
                    @change="updateTotal"
                  />
                </template>
              </el-table-column>

              <!-- 小计 -->
              <el-table-column label="小计" width="120">
                <template #default="scope">
                  <span class="subtotal">¥{{ scope.row.price * scope.row.count }}</span>
                </template>
              </el-table-column>

              <!-- 操作 -->
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button 
                    type="danger" 
                    link
                    @click="removeItem(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 底部结算栏 -->
            <div class="cart-footer">
              <div class="left">
                <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
                <el-button type="text" @click="clearCart">清空购物车</el-button>
              </div>
              <div class="right">
                <div class="total-info">
                  已选择 <span class="count">{{ selectedCount }}</span> 种商品
                  合计：<span class="total-price">¥{{ totalPrice }}</span>
                </div>
                <el-button type="primary" size="large" @click="checkout">
                  结算
                </el-button>
              </div>
            </div>
          </template>
        </div>
      </el-main>

      <el-footer>
        <nav-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavHeader from '../../components/Header.vue'
import NavFooter from '../../components/Footer.vue'
import { useCartStore } from '@/stores/cartStore'
import { useTokenStore } from '@/stores/token'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const tokenStore = useTokenStore()
const router = useRouter()

// 购物车数据
const cartItems = ref([])

// 计算属性
const selectAll = computed({
  get: () => cartItems.value.every(item => item.selected),
  set: (value) => cartItems.value.forEach(item => item.selected = value)
})

const selectedCount = computed(() => 
  cartItems.value.filter(item => item.selected).length
)

const totalPrice = computed(() => 
  cartItems.value
    .filter(item => item.selected)
    .reduce((total, item) => total + item.price * item.count, 0)
    .toFixed(2)
)

// 方法
const handleSelectAll = (val) => {
  cartItems.value.forEach(item => item.selected = val)
}

const updateTotal = () => {
  // 更新总价（这里不需要实际操作，因为使用了计算属性）
}

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
}

const clearCart = () => {
  cartItems.value = []
  cartStore.cartList = []
}

// const checkout = () => {
//   console.log(tokenStore.token)
//   if (!tokenStore.token) {
//     // 如果没有登录，弹出提示框
//     console.log("您还没有登录哦");
//     router.push('/login')
//   } else {
//     // 结算逻辑
//     router.push("/checkout")
//     console.log(cartItems.value)
//   }
// }

// 结算
const checkout = () => {
  if (!tokenStore.token) {
    router.push('/login');
  } else {
    // 结算时只传递选中的商品
    const selectedItems = cartItems.value.filter(item => item.selected);
    router.push({
      name: 'Checkout',
      query: { items: JSON.stringify(selectedItems) }  // 将选中的商品传递到结算页面
    });
  }
}

onMounted(() => {
  cartItems.value = cartStore.cartList
  console.log(cartItems)
})

</script>

<style scoped>
.cart-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.cart-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.product-info {
  width: 400px;
  height: 110px;
  display: flex;
  align-items: center;
}

.product-info img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
}

.product-details h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.specs {
  color: #999;
  font-size: 14px;
}

.price, .subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  font-size: 14px;
}

.count {
  color: #f56c6c;
  margin: 0 5px;
}

.total-price {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
}
</style>
