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
              <img src="@/assets/order-submit.png" style="width: 120px; height:120px">
              <div class="tip">
                <p>订单提交成功！请尽快完成支付。</p>
                <p>支付还剩 <span>{{ formattedTime }}</span>, 超时后将取消订单</p>
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
                <a class="btn wx" @click="selectPayMethod('wx')"></a>
                <a class="btn alipay" @click="selectPayMethod('alipay')"></a>
                <!-- 根据选中的支付方式动态显示图片 -->
                <img v-if="selectedPayMethod === 'wx'" src="@/assets/weixin.jpg" class="payImg">
                <img v-if="selectedPayMethod === 'alipay'" src="@/assets/zhifubao.jpg" class="payImg">
              </div>
              <div class="item">
                <p>支付方式</p>
                <a class="btn">招商银行</a>
                <a class="btn">工商银行</a>
                <a class="btn">建设银行</a>
                <a class="btn">农业银行</a>
                <a class="btn">交通银行</a>
                <a class="btn">中国银行</a>
              </div>
              <!-- 模拟支付成功按钮 -->
              <div class="pay-success-btn">
                <el-button type="primary" @click="paymentSuccess" style="width: 200px; height: 50px;">模拟支付成功按钮!!</el-button>
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
import { ref, onMounted, computed, onBeforeUnmount  } from 'vue'
import NavHeader from '@/components/Header.vue'
import NavFooter from '@/components/Footer.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { updateOrderStatus } from '@/api/order'
import { pay, checkPaymentResult } from '@/api/alipay' 
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 读取本地存储中的倒计时数据
const savedTime = localStorage.getItem('remainingTime')
const initialTime = savedTime ? parseInt(savedTime, 10) : 24 * 60 + 30 // 如果有保存时间，就使用它，否则使用默认时间

const payInfo = ref({
  payMoney: parseFloat(route.query.payMoney) || 0.00,  // 获取查询参数并转换为数字
})


const remainingTime = ref(initialTime) // 使用读取的剩余时间
const timer = ref(null)
const selectedPayMethod = ref('') // 新增：保存当前选中的支付方式

// 计算倒计时的分钟和秒数
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${minutes}分${seconds < 10 ? '0' : ''}${seconds}秒`
})

// 倒计时更新函数
const startCountdown = () => {
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1
      localStorage.setItem('remainingTime', remainingTime.value) // 每次更新时间都保存到 localStorage
    } else {
      clearInterval(timer.value)
      alert('订单已超时，自动取消')
      localStorage.removeItem('remainingTime') // 超时后移除倒计时数据
      router.push('/cart');
    }
  }, 1000)
}

// 更新支付方式的选择
const selectPayMethod = async (method) => {
  selectedPayMethod.value = method
  if (method === 'alipay') {
    try {
      const orderIds = JSON.parse(route.query.orderIds);
      // 提取第一个订单 ID
      const traceNo = orderIds[0];

      // 构造支付数据
      const alipayData = {
        traceNo: traceNo,  // 使用传递的订单ID作为支付追踪号
        totalAmount: payInfo.value.payMoney.toFixed(2), // 总金额
        subject: `订单编号 - ${route.query.orderIds}`,  // 订单标题
      }

      const queryString = new URLSearchParams(alipayData).toString();
      // 发送 GET 请求
      const payPage = await pay(queryString);

      // 假设返回的是支付页面的HTML，嵌入到页面中显示
      const payWindow = window.open("", "支付宝支付", "width=1200, height=900");
      payWindow.document.write(payPage);
      payWindow.document.close();

      // 在支付页面嵌入支付结果监听逻辑
      const checkPaymentStatus = setInterval(async () => {
        const paymentStatus = await checkPaymentResult(traceNo); // 假设后端提供接口查询支付状态
        if (paymentStatus === '已支付') {
          clearInterval(checkPaymentStatus);

          try {
            // 构造发送到后端的订单数据
            const orderList = orderIds.map(orderId => ({ orderId }));
            // 发送请求到后端接口
            const response = await updateOrderStatus(orderList);
          } catch (error) {
            console.error('订单状态更新失败:', error);
          }

          ElMessage.success('支付成功，所有订单状态已更新！');
          cartStore.cartList = [];
          router.push('/pay/success');
        }
      }, 2000); // 每2秒检查一次支付状态
    } catch (error) {
      console.error('支付失败:', error);
      ElMessage.error('支付失败，请稍后再试！');
    }
  }
}

// 支付成功按钮的点击事件
const paymentSuccess = async () => {
  try {
    // 解析订单 ID 数组
    const orderIds = JSON.parse(route.query.orderIds);

    // 构造发送到后端的订单数据
    const orderList = orderIds.map(orderId => ({ orderId }));

    // 发送请求到后端接口
    const response = await updateOrderStatus(orderList);

    // 处理响应
    ElMessage.success('支付成功，订单状态已更新！');
    clearInterval(timer.value);
    cartStore.cartList = [];
    router.push('/pay/success');
  } catch (error) {
    console.error('支付失败:', error);
    ElMessage.error('支付失败，请稍后再试！');
  }
};

// 页面加载时开始倒计时
onMounted(() => {
  startCountdown()
})

onBeforeUnmount(() => {
  localStorage.removeItem('payPageUrl');
});

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

  .payImg{
    width: 210px;
    height: 270px;
    display: block;
    margin-top: 20px;  /* 给图片设置间距，确保它在按钮下面 */
    margin-left: auto;
    margin-right: auto;  /* 图片水平居中 */
  }

  .pay-success-btn {
    margin-top: 60px;
    text-align: center;
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
