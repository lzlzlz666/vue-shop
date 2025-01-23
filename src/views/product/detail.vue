<template>
    <div class="product-detail">
      <el-container>
        <el-header>
          <nav-header />
        </el-header>
  
        <el-main>
          <el-card class="detail-card">
            <el-row :gutter="40">
              <!-- 商品图片 -->
              <el-col :span="12">
                <el-carousel trigger="click" height="460px">
                  <el-carousel-item v-for="i in 4" :key="i">
                    <img :src="product.productImg" alt="product image">
                  </el-carousel-item>
                </el-carousel>
              </el-col>
  
              <!-- 商品信息 -->
              <el-col :span="12">
                <div class="product-info">
                  <h1 class="product-title">{{ product.productName }}</h1>
                  <div class="price-section">
                    <span class="current-price">¥{{ product.productPrice }}</span>
                    <span class="original-price">¥{{ product.productOriginalPrice }}</span>
                  </div>
                  <div class="sales-info">
                    销量：{{ product.productSales }} + | 库存：{{ product.productStock }}
                  </div>
  
                  <!-- 规格选择 -->
                  <div class="description">
                    <h3>详细介绍</h3>
                    <div class="description-info">
                      {{ product.productDescription }}
                    </div>
                  </div>

                  <!-- 规格选择 -->
                  <div class="specs-section">
                    <h3>规格</h3>
                    <el-radio-group v-model="selectedSpec">
                      <el-radio-button label="规格1" />
                      <el-radio-button label="规格2" />
                      <el-radio-button label="规格3" />
                    </el-radio-group>
                  </div>
  
                  <!-- 数量选择 -->
                  <div class="quantity-section">
                    <h3>数量</h3>
                    <el-input-number v-model="quantity" :min="1" :max="99" />
                  </div>
  
                  <!-- 按钮组 -->
                  <div class="action-buttons">
                    <el-button type="primary" size="large" @click="addToCart">
                      加入购物车
                    </el-button>
                    <el-button type="danger" size="large" @click="buyNow">
                      立即购买
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
  
            <!-- 商品详情 -->
            <div class="product-description">
              <el-tabs v-model="activeTab">
                <el-tab-pane label="商品详情" name="detail">
                  商品详情
                </el-tab-pane>
                <el-tab-pane label="商品评价" name="reviews">
                  商品评价内容
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-main>
  
        <el-footer>
          <nav-footer />
        </el-footer>
      </el-container>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import NavHeader from '../../components/Header.vue'
  import NavFooter from '../../components/Footer.vue'
  import { fetchProductDetail } from '@/api/product'; 
  import { ElMessage } from 'element-plus'
  
  const selectedSpec = ref('规格1')
  const quantity = ref(1)
  const activeTab = ref('detail')
  const product = ref({}); // 用于存储商品数据

  const route = useRoute(); // 使用 useRoute 获取当前路由对象
  const router = useRouter();

  onMounted(async () => {
    const productId = route.params.id; // 从路由参数中获取产品 ID
    try {
      product.value = await fetchProductDetail(productId); // 获取商品数据
      console.log(product.value)
    } catch (error) {
      console.error('获取商品数据失败:', error);
    }
  });
  
  import { useCartStore } from '@/stores/cartStore';
  const cartStore = useCartStore();

  const addToCart = () => {
    // 添加到购物车逻辑
    cartStore.addCart({
      productId: product.value.productId,
      name: product.value.productName,
      picture: product.value.productImg,
      price: product.value.productPrice,
      format: selectedSpec.value,
      count: quantity.value,
      select: true,
    })
    ElMessage.success('添加到购物车成功');
    router.push('/cart');
  }
  
  const buyNow = () => {
    // 立即购买逻辑
    ElMessage.warning('请先点击加入购物车哦！');
  }
  </script>
  
  <style scoped>
  .product-detail {
    min-height: 100vh;
  }
  
  .detail-card {
    margin: 20px 0;
  }
  
  .product-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .price-section {
    margin: 20px 0;
  }
  
  .current-price {
    font-size: 28px;
    color: #f56c6c;
    margin-right: 10px;
  }
  
  .original-price {
    font-size: 16px;
    color: #999;
    text-decoration: line-through;
  }
  
  .sales-info {
    color: #666;
    margin: 10px 0;
  }

  .description {
    margin-top: 0px;
  }
  
  .description-info {
    color: #666;
    margin: 10px 0;
  }
  .quantity-section {
    margin: 20px 0;
  }
  
  .quantity-section h3 {
    margin-bottom: 10px;
  }
  
  .action-buttons {
    margin-top: 30px;
  }
  
  .action-buttons .el-button {
    margin-right: 20px;
    width: 180px;
  }
  
  .product-description {
    margin-top: 40px;
  }
  
  .detail-content img {
    width: 100%;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>