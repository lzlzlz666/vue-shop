import { createRouter, createWebHistory } from 'vue-router'

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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router