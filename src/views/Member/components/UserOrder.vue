<script setup>
import { ref, computed, onMounted } from 'vue';
import { getMyOrders, deleteOrder } from '@/api/order';
import { ElMessage, ElNotification  } from 'element-plus';
import { useRouter } from 'vue-router';  // 引入 vue-router

// tab列表
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unPay", label: "待付款" },
  { name: "deliver", label: "已付款" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
];

// 订单列表
const orderList = ref([]);

// 当前选中的 tab
const activeTab = ref('all');

// 当前页数和每页订单数
const currentPage = ref(1);
const pageSize = ref(3);

// 获取订单列表
const fetchMyOrdersList = async () => {
  const data = await getMyOrders();

  // 遍历 data 中的每个订单，修改 paid 字段
  orderList.value = data.map(order => ({
    ...order,
    paid: order.paid === 0 ? 'false' : 'true', // 根据订单的 paid 字段值进行转换
    payMoney: order.payMoney += 10
  }));

  console.log(orderList.value);
};

// 根据 tab 类型过滤订单
const filteredOrders = computed(() => {
  const list = orderList.value; // 获取 orderList 的实际数据

  if (!Array.isArray(list)) {
    return []; // 如果 orderList 不是一个数组，返回空数组
  }

  switch (activeTab.value) {
    case 'all':
      return list;
    case 'unPay':
      return list.filter(order => order.paid === 'false');
    case 'deliver':
      return list.filter(order => order.paid === 'true');
    case 'receive':
      return list.filter(order => order.paid && order.delivered && !order.received);
    case 'comment':
      return list.filter(order => order.paid && order.delivered && !order.commented);
    case 'complete':
      return list.filter(order => order.paid && order.delivered && order.commented);
    case 'cancel':
      return list.filter(order => order.cancelled);
    default:
      return [];
  }
});

// 计算当前页的数据
const currentPageOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredOrders.value.slice(start, end);
});

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

// 处理页码变化
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// 删除订单
const cancelOrder = async (id) => {
  const data = await deleteOrder(id);
    // 成功删除后重新获取订单列表
  await fetchMyOrdersList();
  ElMessage.success('删除订单成功');
}

// 跳转到支付页面
const router = useRouter();  // 获取 router 实例

const goToPayPage = (order) => {
  const payMoney = order.payMoney?.toFixed(2);  // 获取支付金额
  const orderIds = [order.id];  // 获取订单 ID 数组
  router.push({ 
    path: '/pay', 
    query: { payMoney, orderIds: JSON.stringify(orderIds) }  // 跳转并传递查询参数
  });
};

const OrderDetail = (order) => {
  const orderId = order.id;
  router.push({
    path: '/order-details',
    query: { orderId, orderData: JSON.stringify(order)}
  })
}

onMounted(() => {
  fetchMyOrdersList();
});
</script>

<template>
  <div class="order-container">
    <el-tabs v-model="activeTab">
      <!-- tab切换 -->
      <el-tab-pane
        v-for="item in tabTypes"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>

    <div class="main-container">
      <div class="holder-container" v-if="currentPageOrders.length === 0">
        <el-empty description="暂无订单数据" />
      </div>
      <div v-else>
        <!-- 订单列表 -->
        <div class="order-item" v-for="order in currentPageOrders" :key="order.id">
          <div class="head">
            <span>下单时间：{{ formatDate(order.createTime) }}</span>
            <span class="head-right"> 订单编号：{{ order.id }}</span>
          </div>
          <div class="body">
            <div class="column goods">
              <ul>
                <li v-for="item in order.skus" :key="item.productId">
                  <a class="image">
                    <img :src="item.productImg" alt="" />
                  </a>
                  <div class="info">
                    <p class="name ellipsis-2">
                      {{ item.productName }}
                    </p>
                    <p class="attr ellipsis">
                      <span>{{ item.productDescription }}</span>
                    </p>
                  </div>
                  <div class="price">¥{{ item.productPrice?.toFixed(2) }}</div>
                  <div class="count">x{{ item.quantity }}</div>
                </li>
              </ul>
            </div>
            <div class="column amount">
              <p class="red">¥{{ order.payMoney?.toFixed(2) }}</p>
              <p>（含运费：¥{{ order.postFee?.toFixed(2) }}）</p>
              <p>在线支付</p>
            </div>
            <div class="column action">
              <p><a style="color: #409eff;" @click="OrderDetail(order)">查看详情</a></p>
              <p v-if="order.paid === 'false' "><a style="color: #e54d42;" @click="goToPayPage(order)">支付订单</a></p>
              <p><a style="color: #65C1FF;" @click="cancelOrder(order.id)">取消订单</a></p>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="filteredOrders.length"
            :page-size="pageSize"
            v-model:current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  padding: 20px;
  background-color: #f7f7f7;

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    font-weight: bold;
    color: #333;

    .head-right {
      margin-left: 500px;
    }

    span {
      margin-right: 20px;
      font-size: 14px;

      &.down-time {
        margin-right: 0;
        float: right;
      }
    }
  }

  .body {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 10px;
      flex: 1;
      min-width: 150px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 2;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 100px;
              height: 80px;
              border: 2px solid rgb(247, 233, 184);
              overflow: hidden;  // 确保超出部分被隐藏
              display: flex;
              justify-content: center;
              align-items: center;

              img {
                width: 100%;
                height: 100%;
                object-fit: contain;  // 保持图片比例，适应框的尺寸
              }
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                  font-weight: bold;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;
                  margin-top: -12px;
                }
              }
            }

            .price {
              width: 100px;
              font-size: 16px;
              font-weight: bold;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 50px;

        .green {
          color: green;
        }
      }

      &.amount {
        width: 240px;

        .red {
          color: #e54d42;
          font-weight: bold;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;
          color: #409eff;
          padding: 2px;
          border-radius: 5px;
          transition: background-color 0.3s ease, color 0.3s ease;
          text-decoration: none;

          &:hover {
            color: #fff;
            background-color: #c0f5c3;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style> 