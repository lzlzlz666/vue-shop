<template>
  <div>
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main class="main-content">
        <div class="content-wrapper">
          <!-- 这里是支付成功的文字 -->
          <div class="message">
            <h2>支付成功！</h2>
            <p>您的支付已成功处理，感谢您的购买！</p>
          </div>

          <div class="image-placeholder">
            <img src="@/assets/success-image.png" alt="支付成功" />
          </div>
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
</script>

<style scoped>
.main-content {
  width: 100%;
  margin: 0 auto;
  background-color: #f0f0f0;
  padding: 40px;
  padding-left: 300px;
  padding-right: 300px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 400px;
}

.message {
  margin-bottom: 20px;
}

.message h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.message p {
  font-size: 16px;
  color: #777;
}

.image-placeholder {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
}

.image-placeholder img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 8px;
}
</style>
