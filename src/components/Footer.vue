<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于我们</h3>
        <p>公司简介</p>
        <p>联系我们</p>
        <p>招贤纳士</p>
      </div>
      <div class="footer-section">
        <h3>帮助中心</h3>
        <p>购物指南</p>
        <p>支付方式</p>
        <p>配送方式</p>
      </div>
      <div class="footer-section">
        <h3>售后服务</h3>
        <p>退货政策</p>
        <p>退货流程</p>
        <p>售后服务</p>
      </div>
      <div class="footer-section">
        <h3>关注我们</h3>
        <p>微信公众号</p>
        <p>官方微博</p>
        <p>企业邮箱</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 LZ🥳 商城 All Rights Reserved.</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.footer-section {
  flex: 1;
  padding: 0 15px;
}

.footer-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.footer-section p {
  margin: 10px 0;
  color: #666;
  cursor: pointer;
}

.footer-section p:hover {
  color: #409EFF;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  color: #999;
}
</style>