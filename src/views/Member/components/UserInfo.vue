<template>
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img :src="userInfo?.userPic" />
      </div>
      <h4>{{ userInfo?.nickname }}</h4>
    </div>
    <div class="item">
      <a>
        <span class="iconfont icon-hy"></span>
        <p>会员中心</p>
      </a>
      <a>
        <span class="iconfont icon-aq"></span>
        <p>安全设置</p>
      </a>
      <a>
        <span class="iconfont icon-dw"></span>
        <p>地址管理</p>
      </a>
    </div>
  </div>
  <div class="like-container">
    <div class="home-panel">
      <div class="header">
        <h4 data-v-bcb266e0="">猜你喜欢</h4>
      </div>
      <div class="goods-list">
        <!-- <GoodsItem v-for="good in likeList" :key="good.id" :good="good" /> -->
        <ProductCard v-for="product in likeList" :key="product.productId" :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useTokenStore } from '@/stores/token'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification  } from 'element-plus'
import { getUserInfo } from '@/api/user'
import { fetchLikeProducts } from '@/api/product'
import ProductCard from '@/components/ProductCard.vue'

const tokenStore = useTokenStore()
const router = useRouter()

const likeList = ref([
  {
    productId: 1,
    productImg: 'https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/93650672-5399-4b91-8407-86abad4e91ee.png',
    productName: '商品名称 1',
    productPrice: '199.99',
    productOriginalPrice: '299.99',
    productSales: 1200
  },
  {
    productId: 2,
    productImg: 'https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/93650672-5399-4b91-8407-86abad4e91ee.png',
    productName: '商品名称 2',
    productPrice: '299.99',
    productOriginalPrice: '399.99',
    productSales: 950
  },
  {
    productId: 3,
    productImg: 'https://big-event-lz.oss-cn-hangzhou.aliyuncs.com/93650672-5399-4b91-8407-86abad4e91ee.png',
    productName: '商品名称 3',
    productPrice: '129.99',
    productOriginalPrice: '199.99',
    productSales: 1500
  }
]);


const userInfo = ref({
  username: '',
  nickname: '',
  email: '',
  phoneNumber: '',
  sex: '',
  birthday: '',
  address: '',
  userPic: ''
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const data = await getUserInfo(); // 调用封装好的获取用户信息的接口
    userInfo.value = {
      ...data, // 使用从接口获取的数据来更新 userInfo
      sex: data.sex === 1 ? '男' : '女' // 将 sex 从 1/0 转换为 '男'/'女'
    };
  } catch (error) {
    console.error('获取用户信息时出错:', error);
  }
};

const fetchGoodProducts = async (limit) => {
  const data = await fetchLikeProducts(limit);
  likeList.value = data;
}

onMounted(() => {
  // 如果用户未登录 
  if (!tokenStore.token) {
    ElNotification({
      title: '温馨提醒：',
      message: '请先登录！',
      type: 'error',
    });
    router.push('/login');
  } 

  fetchUserInfo();
  fetchGoodProducts(3);
});
</script>

<style scoped lang="scss">
.home-overview {
  height: 120px;
  background: url(@/assets/center-bg.png) no-repeat center / cover;
  display: flex;

  .user-meta {
    flex: 1;
    display: flex;
    align-items: center;

    .avatar {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 60px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    h4 {
      padding-left: 26px;
      font-size: 18px;
      font-weight: normal;
      color: white;
    }
  }

  .item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:first-child {
      border-right: 1px solid #f4f4f4;
    }

    a {
      color: white;
      font-size: 16px;
      text-align: center;

      .iconfont {
        font-size: 32px;
      }

      p {
        line-height: 32px;
      }
    }
  }
}

.like-container {
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
}

.home-panel {
  background-color: #fff;
  padding: 0 20px;
  margin-top: 20px;
  height: 500px;

  .header {
    height: 66px;
    border-bottom: 1px solid #f5f5f5;
    padding: 18px 0;
    display: flex;
    justify-content: space-between;
    align-items: baseline;

    h4 {
      font-size: 22px;
      font-weight: 400;
    }

  }

  .goods-list {
    display: flex;
    justify-content: space-around;
  }
}
</style>