<template>
  <div class="home">
    <el-container>
      <el-header>
        <nav-header />
      </el-header>
      
      <el-main>
        <!-- 轮播图 -->
        <el-carousel height="400px">
          <el-carousel-item v-for="(item, index) in imageItems" :key="index">
            <img :src="item" alt="banner">
          </el-carousel-item>
        </el-carousel>

        <!-- 商品分类 -->
        <div class="category-section">
          <h2>热门分类</h2>
          <el-row :gutter="10">
            <el-col :span="6" v-for="category in categories" :key="category.categoryId">
              <el-card shadow="hover" class="category-card">
                <img :src="category.categoryImg" alt="category" style="width: 100%; height: 200px;">
                <div class="category-name">{{ category.categoryName }}</div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 热门商品 -->
        <div class="product-section">
          <h2>热销商品</h2>
          <el-row :gutter="20">
            <el-col :span="6" v-for="product in hotProducts" :key="product.productId">
              <product-card :product="product" />
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
import { ref, onMounted } from 'vue';
import { fetchCategories } from '@/api/category'; // 导入 fetchCategories 函数
import { fetchHotProducts } from '@/api/product'; // 导入 fetchHotProducts 函数
import { fetchBanners } from '@/api/banner'

// 显式导入轮播图图片
import lunbo1 from '@/assets/lunbo_1.jpg'
import lunbo2 from '@/assets/lunbo_2.jpg'
import lunbo3 from '@/assets/lunbo_3.jpg'


const categories = ref([]); // 用于存储分类数据
const hotProducts = ref([]); // 用于存储热销商品数据
// 将图片路径存放到数组中
const imageItems = ref([]);

const fetchBannerList = async () => {
  const data = await fetchBanners();
  imageItems.value = data.map(item => item.bannerImg);
}

onMounted(async () => {
  fetchBannerList();
  categories.value = await fetchCategories(); // 获取分类数据
  hotProducts.value = await fetchHotProducts(); // 获取热销商品数据

});
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
  margin-top: 10px;
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
