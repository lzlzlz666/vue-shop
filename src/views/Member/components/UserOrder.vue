<script setup>
import { ref, computed } from 'vue';
// tab列表
const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "已付款" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]

// 订单列表
const orderList = [
  {
    id: "1001",
    createTime: "2025-01-15 10:30:00",
    countdown: "02:30:00",
    skus: [
      {
        id: "sku001",
        image: "https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/cb529d34-5a12-47a3-a35d-eac6f6452f73.png",
        name: "商品名称 1",
        attrsText: "颜色: 红色, 尺寸: M",
        realPay: 99.99,
        quantity: 2
      }
    ],
    payMoney: 399.97,
    postFee: 10.00,
    paid: true // 标记已付款
  },
  {
    id: "1003",
    createTime: "2025-01-17 09:00:00",
    skus: [
      {
        id: "sku004",
        image: "https://via.placeholder.com/70",
        name: "商品名称 4",
        attrsText: "颜色: 白色, 尺寸: S",
        realPay: 89.99,
        quantity: 2
      }
    ],
    payMoney: 179.98,
    postFee: 5.00,
    paid: false // 标记待付款
  },
  {
    id: "1004",
    createTime: "2025-01-18 12:30:00",
    skus: [
      {
        id: "sku005",
        image: "https://via.placeholder.com/70",
        name: "商品名称 5",
        attrsText: "颜色: 紫色, 尺寸: L",
        realPay: 129.99,
        quantity: 1
      }
    ],
    payMoney: 129.99,
    postFee: 8.00,
    paid: true // 标记已付款
  }
]

// 当前选中的 tab
const activeTab = ref('all')

// 根据 tab 类型过滤订单
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') {
    return orderList
  } else if (activeTab.value === 'unpay') {
    return orderList.filter(order => !order.paid)
  } else if (activeTab.value === 'deliver') {
    // 假设待发货订单过滤的条件
    return orderList.filter(order => order.paid && !order.delivered)
  } else if (activeTab.value === 'receive') {
    // 假设待收货订单过滤的条件
    return orderList.filter(order => order.paid && order.delivered && !order.received)
  } else if (activeTab.value === 'comment') {
    // 假设待评价订单过滤的条件
    return orderList.filter(order => order.paid && order.delivered && !order.commented)
  } else if (activeTab.value === 'complete') {
    // 假设已完成订单过滤的条件
    return orderList.filter(order => order.paid && order.delivered && order.commented)
  } else if (activeTab.value === 'cancel') {
    // 假设已取消订单过滤的条件
    return orderList.filter(order => order.cancelled)
  }
  return []
})
</script>

<template>
  <div class="order-container">
    <el-tabs v-model="activeTab">
      <!-- tab切换 -->
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" :name="item.name" />
    </el-tabs>

    <div class="main-container">
      <div class="holder-container" v-if="filteredOrders.length === 0">
        <el-empty description="暂无订单数据" />
      </div>
      <div v-else>
        <!-- 订单列表 -->
        <div class="order-item" v-for="order in filteredOrders" :key="order.id">
          <div class="head">
            <span>下单时间：{{ order.createTime }}</span>
            <span>订单编号：{{ order.id }}</span>
          </div>
          <div class="body">
            <div class="column goods">
              <ul>
                <li v-for="item in order.skus" :key="item.id">
                  <a class="image">
                    <img :src="item.image" alt="" />
                  </a>
                  <div class="info">
                    <p class="name ellipsis-2">
                      {{ item.name }}
                    </p>
                    <p class="attr ellipsis">
                      <span>{{ item.attrsText }}</span>
                    </p>
                  </div>
                  <div class="price">¥{{ item.realPay?.toFixed(2) }}</div>
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
              <p><a>查看详情</a></p>
              <p v-if="!order.paid"><a>支付订单</a></p>
              <p><a>取消订单</a></p>
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background layout="prev, pager, next" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
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

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
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
              width: 70px;
              height: 70px;
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
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
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
          color: green;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: green;
          }
        }
      }
    }
  }
}
</style>
