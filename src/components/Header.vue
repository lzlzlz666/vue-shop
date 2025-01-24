<template>
  <div class="header">
    <div class="header-content">
      <!-- Logo -->
      <div class="logo">
        <router-link to="/">
          <h1>LZ🥳 商城</h1>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu">
        <el-menu mode="horizontal" :router="true" class="menu">
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
              <el-avatar :src="userPic" size="small" style="margin-left: 10px;"/>&nbsp;&nbsp; 我的
            </template>
            <el-menu-item index="/member/user">个人中心</el-menu-item>
            <el-menu-item index="/profile">详细资料</el-menu-item>
            <el-menu-item index="/login">我要登录</el-menu-item>
            <el-menu-item @click="handleLogout">退出登录</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, User } from '@element-plus/icons-vue'
import { useTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'
import { useCartStore } from '@/stores/cartStore'
import { getUserInfo } from '@/api/user' // 假设你的接口函数在这个路径

import defaultUserPic from '@/assets/default-user.png'

const cartStore = useCartStore()
const tokenStore = useTokenStore()
const router = useRouter()

const cartItems = ref([])
const userPic = ref('') // 用户头像
const cartCount = ref(0)

// 获取用户信息并设置头像
const fetchUserInfo = async () => {
  try {
    const data = await getUserInfo()
    // 如果 userPic 不为空，使用返回的图片路径，否则使用默认头像
    userPic.value = data.userPic || defaultUserPic
    console.log(userPic.value);
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleLogout = () => {
  tokenStore.removeToken()
  router.push('/')
  ElMessage.success('退出成功!')
}

onMounted(() => {
  userPic.value = defaultUserPic
  fetchUserInfo()
  cartItems.value = cartStore.cartList
})
</script>

<style scoped>
.header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
