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
    path: '/order-details',
    name: 'OrderDetails',
    component: () => import('../views/order/index.vue')
  },
  {
    path: '/pay',
    children: [
      {
        path: '',
        name: 'Pay',
        component: () => import('../views/Pay/index.vue'), // 默认支付页面
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