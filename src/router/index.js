import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: 'RSS 阅读器' }
  },
  {
    path: '/add-feed',
    name: 'AddFeed',
    component: () => import('../views/AddFeed.vue'),
    meta: { title: '添加 RSS 源' }
  },
  {
    path: '/feed/:id',
    name: 'FeedDetail',
    component: () => import('../views/FeedDetail.vue'),
    meta: { title: '文章列表' }
  },
  {
    path: '/article/:id',
    name: 'ArticleReader',
    component: () => import('../views/ArticleReader.vue'),
    meta: { title: '阅读' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { title: '设置' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
