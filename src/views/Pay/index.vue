<template>
  <div>
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main class="main-content">
        <div class="xtx-pay-page">
          <div class="container">
            <!-- 付款信息 -->
            <div class="pay-info">
              <span class="icon iconfont icon-queren2"></span>
              <div class="tip">
                <p>订单提交成功！请尽快完成支付。</p>
                <p>支付还剩 <span>24分30秒</span>, 超时后将取消订单</p>
              </div>
              <div class="amount">
                <span>应付总额：</span>
                <span>¥{{ payInfo.payMoney?.toFixed(2) }}</span>
              </div>
            </div>

            <!-- 付款方式 -->
            <div class="pay-type">
              <p class="head">选择以下支付方式付款</p>
              <div class="item">
                <p>支付平台</p>
                <a class="btn wx"></a>
                <a class="btn alipay" :href="payUrl"></a>
              </div>
              <div class="item">
                <p>支付方式</p>
                <a class="btn">招商银行</a>
                <a class="btn">工商银行</a>
                <a class="btn">建设银行</a>
                <a class="btn">农业银行</a>
                <a class="btn">交通银行</a>
              </div>
            </div>
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

const payInfo = {}
</script>

<style scoped lang="scss">
.xtx-pay-page {
  margin-top: 20px;
}

.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;

  .icon {
    font-size: 80px;
    color: #1dc779;
  }

  .tip {
    padding-left: 10px;
    flex: 1;

    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }

      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }

  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }

      &:last-child {
        color: #1dc779;
        font-size: 20px;
      }
    }
  }
}

.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;

  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;

    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;

    &.active,
    &:hover {
      border-color: #1dc779;
    }

    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png) no-repeat center / contain;
    }

    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg) no-repeat center / contain;
    }
  }
}

.main-content {
  width: 100%; /* 设置宽度为 80% */
  margin: 0 auto; /* 让main区域水平居中 */
  background-color: #f0f0f0; /* 设置灰色背景 */
  padding: 130px; /* 可根据需求调整内边距 */
  padding-bottom: 40px;
  padding-top: 20px;
}
</style>
