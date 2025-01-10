<template>
    <div class="product-list">
      <el-container>
        <el-header>
          <nav-header />
        </el-header>
  
        <el-main>
          <!-- 筛选区域 -->
          <div class="filter-section">
            <el-card>
              <el-form :inline="true">
                <el-form-item label="价格区间">
                  <el-input-number v-model="minPrice" :min="0" placeholder="最低价" />
                  <span class="mx-2">-</span>
                  <el-input-number v-model="maxPrice" :min="0" placeholder="最高价" />
                </el-form-item>
                <el-form-item label="分类">
                  <el-select v-model="category" placeholder="选择分类">
                    <el-option label="全部" value="" />
                    <el-option label="电子产品" value="electronics" />
                    <el-option label="服装" value="clothing" />
                    <el-option label="食品" value="food" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleFilter">筛选</el-button>
                  <el-button @click="resetFilter">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
  
          <!-- 商品列表 -->
          <div class="products-grid">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="i in 12" :key="i">
                <product-card />
              </el-col>
            </el-row>
          </div>
  
          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100"
              :page-size="12"
              @current-change="handlePageChange"
            />
          </div>
        </el-main>
  
        <el-footer>
          <nav-footer />
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import NavHeader from '../../components/Header.vue'
  import NavFooter from '../../components/Footer.vue'
  import ProductCard from '../../components/ProductCard.vue'
  
  const minPrice = ref('')
  const maxPrice = ref('')
  const category = ref('')
  
  const handleFilter = () => {
    // 处理筛选逻辑
  }
  
  const resetFilter = () => {
    minPrice.value = ''
    maxPrice.value = ''
    category.value = ''
  }
  
  const handlePageChange = (page) => {
    console.log('当前页:', page)
  }
  </script>
  
  <style scoped>
  .product-list {
    min-height: 100vh;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
  
  .mx-2 {
    margin: 0 10px;
  }
  
  .products-grid {
    margin: 20px 0;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }
  </style>