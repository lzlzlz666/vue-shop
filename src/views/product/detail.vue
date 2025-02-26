<template>
  <div class="product-detail">
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main>
        <el-card class="detail-card">
          <el-row :gutter="40">
            <el-col :span="12">
              <el-carousel trigger="click" height="460px">
                <el-carousel-item v-for="(img, index) in productImgs" :key="index">
                  <img :src="img" alt="product image" />
                </el-carousel-item>
              </el-carousel>
            </el-col>

            <el-col :span="12">
              <div class="product-info">
                <h1 class="product-title">{{ product.productName }}</h1>
                <div class="price-section">
                  <span class="current-price">¥{{ product.productPrice }}</span>
                  <span class="original-price">¥{{ product.productOriginalPrice }}</span>
                </div>
                <div class="sales-info">
                  销量：{{ product.productSales }} | 库存：{{ product.productStock }}
                </div>
                
                <div class="description">
                  <h3>详细介绍</h3>
                  <div class="description-info">
                    {{ product.productDescription }}
                  </div>
                </div>

                <div class="specs-section">
                  <h3>规格</h3>
                  <el-radio-group v-model="selectedSpec" style="margin-top: 10px;">
                    <el-radio-button v-for="(spec, index) in specs" :key="index" :label="spec" />
                  </el-radio-group>
                </div>

                <div class="quantity-section">
                  <h3>数量</h3>
                  <el-input-number v-model="quantity" :min="1" :max="99" />
                </div>

                <div class="action-buttons">
                  <el-button type="primary" size="large" @click="addToCart">加入购物车</el-button>
                  <el-button type="danger" size="large" @click="buyNow">立即购买</el-button>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="product-description">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="商品详情" name="detail">
                <ProductDetail />
              </el-tab-pane>
              <el-tab-pane label="商品评价" name="reviews">
                <ProductReviews />
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavHeader from '../../components/Header.vue';
import NavFooter from '../../components/Footer.vue';
import { fetchProductDetail } from '@/api/product';
import { ElMessage } from 'element-plus';
import { useCartStore } from '@/stores/cartStore';
import ProductDetail from '@/views/product/components/ProductDetail.vue';
import ProductReviews from '@/views/product/components/ProductReviews.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref({});
const productImgs = computed(() => {
  return Array.isArray(product.value.productImgs) && product.value.productImgs.length > 0 
    ? product.value.productImgs 
    : [product.value.productImg];
});

const specs = computed(() => {
  return product.value.productFormats?.length 
    ? product.value.productFormats 
    : ['规格1', '规格2', '规格3'];
});

const selectedSpec = ref('');
const quantity = ref(1);
const activeTab = ref('detail');

onMounted(async () => {
  const productId = route.params.id;
  try {
    product.value = await fetchProductDetail(productId);
    // 设置默认选中的规格
    selectedSpec.value = specs.value.length > 0 ? specs.value[0] : '规格1';
  } catch (error) {
    console.error('获取商品数据失败:', error);
  }
});

const addToCart = () => {
  cartStore.addCart({
    productId: product.value.productId,
    name: product.value.productName,
    picture: product.value.productImg,
    price: product.value.productPrice,
    format: selectedSpec.value,
    count: quantity.value,
    select: true,
  });
  ElMessage.success('添加到购物车成功');
  router.push('/cart');
};

const buyNow = () => {
  ElMessage.warning('请先点击加入购物车哦！');
};
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
}

.detail-card {
  margin: 20px 0;
  margin-left: 70px;
  margin-right: 70px;
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