<template>
  <div class="content-container">
    <!-- 左侧主图片（大图片） -->
    <div class="main-image">
      <img :src="selectedImage" alt="主商品图片" class="detail-image" />
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
import { ref } from 'vue';

// 定义图片数据
const images = ref([
  'https://shop-mall-lz.oss-cn-hangzhou.aliyuncs.com/5eb2020c-3c4e-4c85-a151-387eaf129f2f.webp',
  'https://shop-mall-lz.oss-cn-hangzhou.aliyuncs.com/73248f52-54ba-441d-992d-b7d31a1915bd.jpg',
  'https://shop-mall-lz.oss-cn-hangzhou.aliyuncs.com/766758e3-2f7f-461a-89d0-140b7a16ffa3.jpeg',
]);

// 选中的图片索引
const currentIndex = ref(0);

// 选中的图片
const selectedImage = ref(images.value[0]);

// 触发图片选择
const selectImage = (index) => {
  currentIndex.value = index;
  selectedImage.value = images.value[index];
};
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