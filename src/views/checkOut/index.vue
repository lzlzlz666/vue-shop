<template>
  <div>
    <el-container>
      <el-header>
        <nav-header />
      </el-header>

      <el-main class="main-content">
        <div class="shop-pay-checkout-page">
          <div class="container">
            <div class="wrapper">
              <!-- 收货地址 -->
              <h3 class="box-title">收货地址</h3>
              <div class="box-body">
                <div class="address">
                  <div class="text">
                    <div class="none" v-if="!curAddress">您需要先添加收货地址才可提交订单。</div>
                    <ul v-else>
                      <li><span>收<i />货<i />人：</span>{{ curAddress.receiverName }}</li>
                      <li><span>联系方式：</span>{{ curAddress.contact }}</li>
                      <li><span>收货地址：</span>{{ curAddress.address }}</li>
                    </ul>
                  </div>
                  <div class="action">
                    <el-button size="large" @click="toggleFlag = true">切换地址</el-button>
                    <el-button size="large" @click="addFlag = true">添加地址</el-button>
                  </div>
                </div>
              </div>

              <!-- 商品信息 -->
              <h3 class="box-title">商品信息</h3>
              <div class="box-body">
                <table class="goods">
                  <thead>
                    <tr>
                      <th width="520">商品信息</th>
                      <th width="170">单价</th>
                      <th width="170">数量</th>
                      <th width="170">小计</th>
                      <th width="170">实付</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="i in cartItems" :key="i.productId">
                      <td>
                        <a class="info">
                          <img :src="i.picture" alt="">
                          <div class="right">
                            <p>{{ i.name }}</p>
                            <p>{{ i.format }}</p>
                          </div>
                        </a>
                      </td>
                      <td>&yen;{{ i.price }}</td>
                      <td>{{ i.count }}</td>
                      <td>&yen;{{ i.price * i.count }}</td>
                      <td>&yen;{{ i.price * i.count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- 配送时间 -->
              <h3 class="box-title">配送时间</h3>
              <div class="box-body">
                <a class="my-btn" :class="{ active: selectedDeliveryTime === '不限送货时间' }" @click="selectedDeliveryTime = '不限送货时间'">不限送货时间：周一至周日</a>
                <a class="my-btn" :class="{ active: selectedDeliveryTime === '工作日送货' }" @click="selectedDeliveryTime = '工作日送货'">工作日送货：周一至周五</a>
                <a class="my-btn" :class="{ active: selectedDeliveryTime === '双休日、假日送货' }" @click="selectedDeliveryTime = '双休日、假日送货'">双休日、假日送货：周六至周日</a>
              </div>

              <!-- 支付方式 -->
              <h3 class="box-title">支付方式</h3>
              <div class="box-body">
                <a class="my-btn" :class="{ active: selectedPaymentMethod === '在线支付' }" @click="selectedPaymentMethod = '在线支付'">在线支付</a>
                <a class="my-btn" :class="{ active: selectedPaymentMethod === '货到付款' }" @click="selectedPaymentMethod = '货到付款'">货到付款</a>
                <span style="color:#999">货到付款需付5元手续费</span>
              </div>

              <!-- 金额明细 -->
              <h3 class="box-title">金额明细</h3>
              <div class="box-body">
                <div class="total">
                  <dl>
                    <dt>商品件数：</dt>
                    <dd>{{ cartItems.length }}件</dd>
                  </dl>
                  <dl>
                    <dt>商品总价：</dt>
                    <dd>¥{{ sumPrice }}</dd>
                  </dl>
                  <dl>
                    <dt>运<i></i>费：</dt>
                    <dd>¥{{ transitPrice }}</dd>
                  </dl>
                  <dl>
                    <dt>应付总额：</dt>
                    <dd class="price">{{ sumPrice + transitPrice }}</dd>
                  </dl>
                </div>
              </div>

              <!-- 提交订单 -->
              <div class="submit">
                <el-button type="danger" size="large" style="margin-right: 60px;">取消订单</el-button>
                <el-button @click="confirmOrder()" type="primary" size="large">提交订单</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 地址切换 -->
        <el-dialog v-model="toggleFlag" title="切换收货地址" width="30%" center>
          <div class="addressWrapper">
            <div class="text item" 
                  :class="{active:activeAddress.userAddressId === item.userAddressId}" 
                  @click="switchAddress(item)"
                  v-for="item in checkInfo"  :key="item.id">
              <ul>
              <li><span>收<i />货<i />人：</span>{{ item.receiverName }} </li>
              <li><span>联系方式：</span>{{ item.contact }}</li>
              <li><span>收货地址：</span>{{ item.address }}</li>
              </ul>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="toggleFlag = false">取消</el-button>
              <el-button @click="confirm()" type="primary">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 添加地址 -->
        <el-dialog v-model="addFlag" title="添加收货地址" width="30%" center>
          <el-form :model="newAddress" ref="addressForm" label-width="80px">
            <el-form-item label="收货人" :rules="[{ required: true, message: '请输入收货人姓名', trigger: 'blur' }]">
              <el-input v-model="newAddress.receiverName" placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :rules="[{ required: true, message: '请输入联系方式', trigger: 'blur' }]">
              <el-input v-model="newAddress.contact" placeholder="请输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="收货地址" :rules="[{ required: true, message: '请输入收货地址', trigger: 'blur' }]">
              <el-input v-model="newAddress.address" placeholder="请输入收货地址"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addFlag = false">取消</el-button>
              <el-button @click="addNewAddress" type="primary">确定</el-button>
            </span>
          </template>
        </el-dialog>

      </el-main>

      <el-footer>
        <nav-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import NavHeader from '../../components/Header.vue'
import NavFooter from '../../components/Footer.vue'
import { useCartStore } from '@/stores/cartStore'
import { fetchUserAddressList, updateDefaultAddress, addUserAddress, createOrder } from '@/api/order'

import { useRouter } from 'vue-router';

const cartStore = useCartStore()
const router = useRouter();

// 购物车数据
const cartItems = ref([])
const checkInfo = ref([]) // 订单对象
const curAddress = ref(null) // 地址对象
const sumPrice = ref(0)
const transitPrice = ref(10)
const toggleFlag = ref(false)
const addFlag = ref(false)
const newAddress = ref({
  receiverName: '',
  contact: '',
  address: ''
})

// 配送时间和支付方式
const selectedDeliveryTime = ref('不限送货时间')
const selectedPaymentMethod = ref('在线支付')

// 计算总价格
const calculateSumPrice = () => {
  sumPrice.value = cartItems.value.reduce((total, item) => {
    return total + (item.price * item.count)
  }, 0)
}

const activeAddress = ref({})
// 切换地址
const switchAddress = (item) => {
  activeAddress.value = item;
}

// 确认切换地址
const confirm = (async () => {
  curAddress.value = activeAddress.value;
  const data = await updateDefaultAddress(activeAddress.value.userAddressId)
  toggleFlag.value = false;
  ElMessage.success(' 切换地址成功！！');
})

const addNewAddress = async () => {
  try {
    // 提交数据给后端
    const data = await addUserAddress(newAddress.value);

    addFlag.value = false;
    // 可选：重新加载地址列表，或者直接将新地址添加到 checkInfo
    checkInfo.value = await fetchUserAddressList();
    // 清空表单
    newAddress.value = { receiverName: '', contact: '', address: '' };
    ElMessage.success('添加地址成功！');
  } catch (error) {
    console.error('添加地址失败', error);
    ElMessage.error('添加地址失败!!');
  }
};

const confirmOrder = async () => {
  if (!curAddress.value) {
    ElMessage.warning('请先选择收货地址！');
    return;
  }

  // 从购物车中提取订单信息
  const orderItems = cartItems.value.map((item) => ({
    productId: item.productId,
    productFormat: item.format,
    productCount: item.count,
    productPrice: item.price
  }));

  // 用于存储所有生成订单的 orderId
  const orderIds = [];

  try {
    // 循环调用后端接口，为每个商品生成一个订单
    for (const orderItem of orderItems) {
      const result = await createOrder(orderItem);
      console.log('订单生成成功:', result);

      // 收集 orderId
      if (result.orderId) {
        orderIds.push(result.orderId);
      }
    }

    // 如果所有订单生成成功，提示用户并跳转到支付页面
    ElMessage.success('所有订单生成成功！');
    router.push({
      path: '/pay',
      query: {
        payMoney: (sumPrice.value + transitPrice.value).toFixed(2),
        orderIds: JSON.stringify(orderIds) // 将 orderId 数组传递到支付页面
      }
    });
  } catch (error) {
    ElMessage.error('订单生成失败，请稍后再试！');
    console.error('订单生成失败:', error);
  }
};


onMounted(async () => {
  checkInfo.value = await fetchUserAddressList();

  // 设置默认地址
  curAddress.value = checkInfo.value.find(address => address.defaultAddress === 0);

  const selectedItems = JSON.parse(router.currentRoute.value.query.items || '[]');
  cartItems.value = selectedItems;
  console.log(cartItems.value);
  calculateSumPrice();
});

</script>

<style scoped lang="scss">
.shop-pay-checkout-page {
  margin-top: 20px;

  .wrapper {
    background: #fff;
    padding: 0 20px;

    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }

    .box-body {
      padding: 20px 0;
    }
  }
}

.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: green;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

.goods {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  .info {
    display: flex;
    text-align: left;

    img {
      width: 70px;
      height: 70px;
      margin-right: 20px;
    }

    .right {
      line-height: 24px;

      p {
        &:last-child {
          color: #999;
        }
      }
    }
  }

  tr {
    th {
      background: #f5f5f5;
      font-weight: normal;
    }

    td,
    th {
      text-align: center;
      padding: 20px;
      border-bottom: 1px solid #f5f5f5;

      &:first-child {
        border-left: 1px solid #f5f5f5;
      }

      &:last-child {
        border-right: 1px solid #f5f5f5;
      }
    }
  }
}

.my-btn {
  width: 228px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-right: 25px;
  color: #666666;
  display: inline-block;

  &.active,
  &:hover {
    border-color: green;
  }
}

.total {
  dl {
    display: flex;
    justify-content: flex-end;
    line-height: 50px;

    dt {
      i {
        display: inline-block;
        width: 2em;
      }
    }

    dd {
      width: 240px;
      text-align: right;
      padding-right: 70px;

      &.price {
        font-size: 20px;
        color: green;
      }
    }
  }
}

.submit {
  text-align: right;
  padding: 60px;
  border-top: 1px solid #f5f5f5;
}

.addressWrapper {
  max-height: 500px;
  overflow-y: auto;
}

.text {
  flex: 1;
  min-height: 90px;
  display: flex;
  align-items: center;

  &.item {
    border: 1px solid #f5f5f5;
    margin-bottom: 10px;
    cursor: pointer;

    &.active,
    &:hover {
      border-color: green;
      background: lighten(green, 50%);
    }

    >ul {
      padding: 10px;
      font-size: 14px;
      line-height: 30px;
    }
  }
}

.main-content {
  width: 100%; /* 设置宽度为 80% */
  margin: 0 auto; /* 让main区域水平居中 */
  background-color: #f0f0f0; /* 设置灰色背景 */
  padding: 130px; /* 可根据需求调整内边距 */
  padding-top: 20px;
}
</style>
