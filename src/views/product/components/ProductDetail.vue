<template>
  <div class="content-container">
    <!-- 左侧主图片（大图片） -->
    <div class="main-image">
      <!-- 如果没有选中的图片，则显示"暂无商品详情" -->
      <img v-if="selectedImage" :src="selectedImage" alt="主商品图片" class="detail-image" />
      <div v-else class="no-image">暂无商品详情</div>
    </div>

    <!-- 右侧小图片列表 -->
    <div class="small-images">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        :alt="'小商品图片 ' + (index + 1)"
        class="small-image"
        @click="selectImage(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchProductDetail } from '@/api/product'; 
import { useRoute, useRouter } from 'vue-router'

const route = useRoute(); // 使用 useRoute 获取当前路由对象
const router = useRouter();

// 定义图片数据
const images = ref([]);

// 选中的图片索引
const currentIndex = ref(0);
const product = ref({}); // 用于存储商品数据

// 选中的图片
const selectedImage = ref(null); // 初始设为空

// 触发图片选择
const selectImage = (index) => {
  currentIndex.value = index;
  selectedImage.value = images.value[index];
};

onMounted(async () => {
  const productId = route.params.id; // 从路由参数中获取产品 ID
  try {
    product.value = await fetchProductDetail(productId); // 获取商品数据
    console.log(product.value);
    images.value = product.value.productDetailImgs || [];
    if (images.value.length > 0) {
      selectedImage.value = images.value[0]; // 设置默认选中的图片
    }
  } catch (error) {
    console.error('获取商品数据失败:', error);
  }
});
</script>

<style scoped>
.content-container {
  display: flex;
  margin-top: 10px;
}

.main-image {
  width: 100%;
  padding: 10px;
  background-color: #f5f5f5;
}

.detail-image {
  width: 100%;
  height: auto;
}

.no-image {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 16px;
  background-color: #f5f5f5;

}

.small-images {
  width: 10%;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.small-image {
  width: 80px;
  height: auto;
  border: 1px solid #ccc;
  cursor: pointer;
  margin: 5px;
}

.small-image:hover {
  border: 2px solid #42b983;
}
</style>
