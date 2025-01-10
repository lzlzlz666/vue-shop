<template>
    <div class="home">
      <el-container>
        <el-header>
          <nav-header />
        </el-header>
        
        <el-main>
          <!-- 轮播图 -->
          <el-carousel height="400px">
            <el-carousel-item v-for="item in 4" :key="item">
              <img :src="`https://picsum.photos/1200/400?random=${item}`" alt="banner">
            </el-carousel-item>
          </el-carousel>
  
          <!-- 商品分类 -->
          <div class="category-section">
            <h2>热门分类</h2>
            <el-row :gutter="20">
              <el-col :span="6" v-for="i in 4" :key="i">
                <el-card shadow="hover" class="category-card">
                  <img src="@/assets/yhr.jpg" alt="category">
                  <div class="category-name">分类 {{ i }}</div>
                </el-card>
              </el-col>
            </el-row>
          </div>
  
          <!-- 热门商品 -->
          <div class="product-section">
            <h2>热门商品</h2>
            <el-row :gutter="20">
              <el-col :span="6" v-for="i in 8" :key="i">
                <product-card />
              </el-col>
            </el-row>
          </div>
        </el-main>
  
        <el-footer>
          <nav-footer />
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import NavHeader from '@/components/Header.vue'
  import NavFooter from '@/components/Footer.vue'
  import ProductCard from '@/components/ProductCard.vue'
  </script>
  
  <style scoped>
  .home {
    min-height: 100vh;
  }
  
  .el-header, .el-footer {
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .category-section, .product-section {
    margin: 40px 0;
  }
  
  .category-card {
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
  }
  
  .category-name {
    margin-top: 10px;
    font-size: 16px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>