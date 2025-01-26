<template>
  <el-container>
    <el-header>
      <NavHeader /> <!-- 引入头部组件 -->
    </el-header>

    <el-main class="main-content">
      <div class="order-details" v-if="order && Object.keys(order).length > 0">
        <div class="order-header">
          <h2>订单详情</h2>
          <div class="order-info">
            <span>订单编号：{{ order.id }}</span>
            <span>下单时间：{{ formatDate(order.createTime) }}</span>
          </div>
        </div>
        <div class="order-items" v-if="order.skus && order.skus.length > 0">
          <div class="item" v-for="item in order.skus" :key="item.productId">
            <div class="product-image">
              <img :src="item.productImg" alt="Product Image" />
            </div>
            <div class="product-info">
              <p class="name">{{ item.productName }}</p>
              <p class="attrs">{{ item.productDescription }}</p>
              <p class="specs">{{ item.productFormat }}</p> <!-- 新增规格信息 -->
            </div>
            <div class="product-price">
              <p>¥{{ item.productPrice }}</p>
              <p>x{{ item.quantity }}</p>
            </div>
          </div>
        </div>
        <div class="order-summary" v-if="order.payMoney != null">
          <div class="payment">
            <p>支付金额：¥{{ order.payMoney }}</p>
            <p>运费：¥{{ order.postFee }}</p>
            <p class="payment-status">
              支付状态：
              <span :class="['status', { paid: order.paid, unpaid: !order.paid }]">
                {{ order.paid === 'true' ? '已支付' : '待支付' }}
              </span>
            </p>
          </div>
          <!-- 将收货地址移动到这里 -->
          <div class="order-address">
            <h3>收货地址</h3>
            <p>{{ order.address }}</p>
          </div>
          <div class="order-contact">
            <h3>联系电话</h3>
            <p>{{ order.contact }}</p>
          </div>
        </div>
      </div>
      <div class="empty-content" v-else>
        <p>暂无订单数据</p>
      </div>
    </el-main>

    <el-footer>
      <NavFooter /> <!-- 引入底部组件 -->
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 用于获取路由参数
import NavHeader from '@/components/Header.vue'; // 引入头部组件
import NavFooter from '@/components/Footer.vue'; // 引入底部组件

const route = useRoute();

// 从路由中获取订单数据
const orderId = route.query.orderId;
const orderData = route.query.orderData ? JSON.parse(route.query.orderData) : null;

// 如果有订单数据，则使用传递的数据，否则使用默认数据
const order = ref(orderData);

// 格式化时间的方法
const formatDate = (dateString) => {
  const date = new Date(dateString); // 创建 Date 对象
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24小时制
  };
  return date.toLocaleString('zh-CN', options); // 格式化日期为中文标准格式
};

onMounted(() => {
  console.log(`Order ID: ${orderId}`);
  console.log('Order Data:', order.value);
});
</script>

<style scoped lang="scss">
body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

.el-container {
  display: flex;
  flex-direction: column;
  min-height: 74vh;
}

.el-header {
  color: #fff;
  line-height: 60px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 20px;
  padding-left: 100px;
  padding-right: 100px;
  background-color: #f7f7f7;
}

.order-details {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-weight: bold;
    font-size: 20px;
    color: #333;
  }
}

.order-info {
  span {
    margin-right: 10px;
    font-size: 14px;
    color: #666;
  }
}

.order-items {
  display: flex;
  flex-direction: column;
}

.item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-image {
  width: 260px;
  height: 200px;
  overflow: hidden;
  margin-right: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px; /* 圆角边框 */
  }
}

.product-info {
  flex: 1;

  p {
    margin-left: 60px;
    font-size: 16px;

    &.name {
      font-weight: bold;
      font-size: 26px;
      margin-bottom: 5px;
      color: #333; /* 深灰色 */
    }

    &.attrs {
      color: #888; /* 灰色 */
      font-size: 16px;
      margin-top: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis; /* 超过部分省略号 */
    }

    &.specs {
      color: #47a7f5; /* 深灰色 */
      font-size: 14px;
      margin-top: 16px;
    }
  }
}

.product-price {
  text-align: right;

  p {
    margin-right: 100px;

    &:first-child {
      font-weight: bold;
      color: #e54d42; /* 红色 */
      font-size: 30px;
    }

    &:last-child {
      font-size: 20px;
      color: #666; /* 深灰色 */
    }
  }
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-top: 1px solid #ddd;
  padding-top: 20px;
  margin-top: 20px;
  padding-left: 30px;
}

.payment {
  flex: 1;
  margin-right: 20px;

  p {
    margin: 0;
    margin-bottom: 10px;

    &.red {
      color: #e54d42; /* 红色 */
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.payment-status {
  font-size: 16px;
  font-weight: bold;

  .status {
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 20px;
    color: #fff;
  }

  .paid {
    background-color: #409eff; /* 深蓝色 */
  }

  .unpaid {
    background-color: #e54d42; /* 红色 */
  }
}


.order-address {
  flex: 0.9;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 15px;
  margin-left: 20px;

  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
}

.order-contact {
  flex: 0.9;
  background-color: #f5f5f5;
  border-radius: 5px;
  padding: 15px;
  margin-left: 20px;

  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #666;
  }
}

.empty-content {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #999;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

a {
  color: #65C1FF; /* 淡蓝色 */
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff; /* 深蓝色 */
  }
}
</style>