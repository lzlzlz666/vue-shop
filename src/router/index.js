import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/product/list.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../views/product/detail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/index.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/profile/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/login.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/checkOut/index.vue')
  },
  {
    path: '/pay',
    children: [
      {
        path: '',
        name: 'Pay',
        component: () => import('../views/Pay/index.vue'), // 默认支付页面
        beforeEnter: (to, from, next) => {
          // 允许从结算页面跳转到支付页面
          if (from.name === 'Checkout') {
            // 保存原始 URL 参数
            localStorage.setItem('payPageUrl', JSON.stringify(to.query));
            next();
          } else {
            // 检查 URL 参数是否被修改
            const originalQuery = JSON.parse(localStorage.getItem('payPageUrl') || '{}');
            if (JSON.stringify(to.query) === JSON.stringify(originalQuery)) {
              next(); // 参数未被修改，允许访问
            } else {
              // 参数被修改，提示用户并重定向到购物车
              ElMessage.error('支付页面参数错误，请返回购物车重新提交订单！');
              next({ name: 'Cart' });
            }
          }
        }
      },
      {
        path: 'success',
        name: 'PaySuccess',
        component: () => import('../views/Pay/paySuccess.vue') // 支付成功页面
      }
    ]
  },
  {
    path: '/member',
    name: 'Member',
    component: () => import('../views/Member/index.vue'),
    children:[
      {
        path:'user',
        name:'UserInfo',
        component: () => import('../views/Member/components/UserInfo.vue'),
      },
      {
        path:'order',
        name:'UserOrder',
        component: () => import('../views/Member/components/UserOrder.vue'),
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;