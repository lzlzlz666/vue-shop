<template>
  <div class="header">
    <div class="header-content">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <h1>LZ🥳 商城</h1>
        </router-link>
      </div>

      <!-- 搜索框，只有在 /products 路由下显示 -->
      <!-- <div class="search" v-if="isProductsPage">
        <el-input
          v-model="searchText"
          placeholder="请输入搜索关键词"
          class="search-input"
        >
          <template #append>
            <el-button :icon="Search">搜索</el-button>
          </template>
        </el-input>
      </div> -->

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <el-menu
          mode="horizontal"
          :router="true"
          class="menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/products">全部商品</el-menu-item>
          <el-menu-item index="/cart">
            <el-badge :value="cartItems.length" class="cart-badge">
              <el-icon><ShoppingCart /></el-icon> 购物车
            </el-badge>
          </el-menu-item>

          <!-- 用户菜单 -->
          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon> 个人中心
            </template>
            <el-menu-item index="/orders">我的订单</el-menu-item>
            <el-menu-item index="/profile">个人信息</el-menu-item>
            <el-menu-item index="/login">我要登录</el-menu-item>
            <el-menu-item @click="handleLogout">退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, ShoppingCart, User } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'

const searchText = ref('')

import { useCartStore } from '@/stores/cartStore'
const cartStore = useCartStore();
const tokenStore = useTokenStore()

const cartCount = ref(0);
const cartItems = ref([]);

// 获取当前路由信息
// const route = useRoute()

// 判断是否是 /products 路由
// const isProductsPage = computed(() => route.path === '/products')

const handleLogout = () => {
  tokenStore.removeToken();
  ElMessage.success('退出成功!');
}

onMounted(() => {
  cartItems.value = cartStore.cartList
  console.log(cartItems)
})

</script>

<style scoped>
.header {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo {
  width: 120px;
}

.logo a {
  text-decoration: none;
  color: #409EFF;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
}

.search {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-input :deep(.el-input-group__append) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
}

.nav-menu {
  display: flex;
  align-items: center;
}

.menu {
  border-bottom: none;
}

.cart-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
  transform: translate(24px, 2px);
}

.el-menu-item [class^="el-icon-"] {
  margin-right: 5px;
}
</style>
