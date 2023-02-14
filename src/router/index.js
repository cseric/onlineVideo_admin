import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/adminLayout'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/admin/adminHome')
      },
      {
        path: 'admin-list',
        component: () => import('@/views/admin/adminList')
      },
      {
        path: 'update-pass',
        component: () => import('@/views/admin/updatePass')
      },
      {
        path: 'user-list',
        component: () => import('@/views/user/userList')
      },
      {
        path: 'video-list',
        component: () => import('@/views/video/videoList')
      },
      {
        path: 'audit-list',
        component: () => import('@/views/video/videoAudit')
      },
      {
        path: 'comment-list',
        component: () => import('@/views/comment/commentList')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/adminLogin')
  },
  {
    path: '*',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  const token = store.state.adminToken
  if (token) {
    // 登录后不能访问登录界面
    if (whiteList.includes(to.path)) {
      next('/')
    }
    next()
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 访问白名单外的uri强制跳转登录界面
      next('/login')
    }
  }
})

export default router
