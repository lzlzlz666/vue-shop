<template>
    <el-card shadow="hover" class="product-card">
      <img src="@/assets/wrx.jpg" class="product-image">
      <div class="product-info">
        <h3 class="product-title">商品标题</h3>
        <div class="product-price">
          <span class="price">¥299</span>
          <span class="original-price">¥399</span>
        </div>
        <div class="product-bottom">
          <span class="sales">销量: 999</span>
          <el-button type="primary" size="small" @click="addToCart">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
        </div>
      </div>
    </el-card>
  </template>
  
  <script setup>
  const addToCart = () => {
    // 添加到购物车逻辑
  }
  </script>
  
  <style scoped>
  .product-card {
    margin-bottom: 20px;
    transition: all 0.3s;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .product-title {
    font-size: 16px;
    margin: 10px 0;
    height: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .product-price {
    margin: 10px 0;
  }
  
  .price {
    color: #f56c6c;
    font-size: 20px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 14px;
  }
  
  .product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .sales {
    color: #999;
    font-size: 14px;
  }
  </style>