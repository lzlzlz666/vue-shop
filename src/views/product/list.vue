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
              <!-- 价格区间 -->
              <el-form-item label="价格区间">
                <el-input-number v-model="filterParams.minPrice" :min="0" placeholder="最低价" />
                <span class="mx-2">-</span>
                <el-input-number v-model="filterParams.maxPrice" placeholder="最高价" />
              </el-form-item>

              <!-- 商品名称 -->
              <el-form-item label="商品名称">
                <el-input v-model="filterParams.productName" placeholder="请输入商品名称" clearable />
              </el-form-item>

              <!-- 分类 -->
              <el-form-item label="分类">
                <el-select v-model="filterParams.category" placeholder="选择分类">
                  <el-option label="全部" value="" />
                  <!-- 动态生成分类选项 -->
                  <el-option v-for="category in allCategories" 
                    :key="category.categoryId" 
                    :label="category.categoryName" 
                    :value="category.categoryId" />
                </el-select>
              </el-form-item>

              <!-- 筛选和重置按钮 -->
              <el-form-item>
                <el-button type="primary" @click="handleFilter">筛选</el-button>
                <el-button @click="resetFilter">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 商品列表 -->
        <div class="products-grid">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="product in allProducts" :key="product.productId">
              <product-list :product="product" />
            </el-col>
          </el-row>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="totalProducts"
            :page-size="filterParams.pageSize"
            :current-page="filterParams.currentPage"
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
import { ref, onMounted } from 'vue'
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import ProductList from '@/components/ProductList.vue'
import { fetchProductList } from '@/api/product';
import { fetchCategories } from '@/api/category'

const filterParams = ref({
  minPrice: 0,
  maxPrice: null,
  productName: '',
  category: '',  // 默认值为空字符串，表示全部
  currentPage: 1,  // 当前页
  pageSize: 12,    // 每页显示商品数
});
const allProducts = ref([]); // 存储所有商品数据
const totalProducts = ref(0); // 商品的总数量
const allCategories = ref([]); // 存储分类数据

// 筛选
const handleFilter = () => {
  fetchProducts(); // 重新加载商品数据
};

// 重置筛选
const resetFilter = () => {
  filterParams.value.minPrice = '';
  filterParams.value.maxPrice = '';
  filterParams.value.productName = '';
  filterParams.value.category = ''; // 重置为“全部”
  filterParams.value.currentPage = 1; // 每次筛选时，重置为第一页
  fetchProducts(); // 重置后重新加载商品数据
};

// 请求商品数据
const fetchProducts = async () => {
  try {
    console.log(filterParams.value.category);
    const { minPrice, maxPrice, productName, category, currentPage, pageSize } = filterParams.value;
    const data = await fetchProductList(currentPage, pageSize, category, productName, minPrice, maxPrice); // 添加分类字段
    totalProducts.value = data.total;
    allProducts.value = data.items;  // 假设返回的数据结构中有 items
  } catch (error) {
    console.error('加载商品数据失败:', error);
  }
};

// 请求分类数据
const fetchCategory = async () => {
  try {
    allCategories.value = await fetchCategories(); // 获取所有分类信息
  } catch (error) {
    console.error('加载分类数据失败:', error);
  }
};

// 页码变化时
const handlePageChange = (page) => {
  filterParams.value.currentPage  = page;
  fetchProducts(); // 请求新页的数据
};

onMounted(() => {
  fetchProducts(); // 页面加载时获取所有商品数据
  fetchCategory(); // 页面加载时获取所有分类数据
});
</script>

<style lang="scss" scoped>
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

.el-form-item {
  margin-right: 20px;  /* 使每个表单项有适当的间隔 */
}

.el-form-item label {
  font-weight: bold;
  min-width: 100px; /* 确保标签的宽度一致 */
}

.el-input, .el-select, .el-input-number {
  width: 200px;  /* 统一输入框的宽度 */
}

.el-button {
  margin-right: 10px;
}
</style>
