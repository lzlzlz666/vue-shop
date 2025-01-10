<template>
    <div class="header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo">
          <router-link to="/">
            <h1>Vue商城</h1>
          </router-link>
        </div>
  
        <!-- 搜索框 -->
        <div class="search">
          <el-input
            v-model="searchText"
            placeholder="请输入搜索关键词"
            class="search-input"
          >
            <template #append>
              <el-button :icon="Search">搜索</el-button>
            </template>
          </el-input>
        </div>
  
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
              <el-badge :value="cartCount" class="cart-badge">
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
              <el-menu-item @click="handleLogout">退出登录</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Search, ShoppingCart, User } from '@element-plus/icons-vue'
  
  const searchText = ref('')
  const cartCount = ref(0)
  
  const handleLogout = () => {
    // 退出登录逻辑
    console.log('logout')
  }
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