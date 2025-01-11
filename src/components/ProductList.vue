<template>
  <router-link :to="`/product/${product.productId}`" class="routerLink">
    <el-card shadow="hover" class="product-card">
      <img :src="product.productImg" class="product-image" alt="商品图片">
      <div class="product-info">
        <h3 class="product-title">{{ product.productName }}</h3>
        <div class="product-price">
          <span class="price">
            <span class="priceSign">¥</span>
            {{ product.productPrice }}</span>
          <span class="original-price">¥{{ product.productOriginalPrice }}</span>
        </div>
        <div class="product-bottom">
          <span class="sales">销量: {{ product.productSales }}</span>
          <el-button class="custom-button" size="big" @click="addToCart">
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script setup>
import { defineProps, onMounted } from 'vue';
import { ShoppingCart } from '@element-plus/icons-vue';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const addToCart = () => {
  // 添加到购物车逻辑
}

onMounted(async () => {
  console.log(product)
});
</script>

<style lang="scss" scoped>
/* 针对 <router-link> 去除默认样式 */
.routerLink {
  text-decoration: none;   /* 去掉下划线 */
  color: inherit;          /* 继承父元素的文字颜色 */
}

.product-card {
  margin: 10px 0 20px;
  height: 400px;  
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .product-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
  }

  .product-info {
    padding: 10px;

    .product-title {
      font-size: 16px;
      margin: 6px 0;
      height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
    }

    .product-price {
      margin: 10px 0;

      .price,
      .original-price {
        color: #f56c6c;
        font-size: 22px;
        font-weight: bold;
        margin-right: 10px;
      }

      .priceSign {
        font-size: 13px;
      }

      .original-price {
        color: #999;
        text-decoration: line-through;
        font-size: 14px;
      }
    }

    .product-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: -10px;

      .sales {
        color: rgb(96, 165, 225);
        font-size: 14px;
      }
    }
  }
}

</style>