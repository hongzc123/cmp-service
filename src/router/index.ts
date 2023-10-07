import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { constantRoutes, matchConstantRoute } from './constantRoutes'
import { useAppStore } from '@/stores/app'
import { ElMessageBox } from 'element-plus'

let isInit = true // APP 初始化标识
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  const store = useAppStore()

  // 初始化数据
  if (isInit) store.init()
  // 如果访问静态路由则放过
  if (matchConstantRoute(to.path)) return next()
  // 如果没有 token 就去登录
  if (!store.token) return next({ name: 'Login', query: { redirect: to.path } })
  // 初始化时由于动态添加了路由，所以需要重定向到对应路由
  if (isInit) {
    isInit = false
    return next({ ...to, replace: true })
  }

  // 开始报价拦截-页面非点击取消或返回，给出浏览器警告确认
  // console.log('getPageBackState', store.getPageBackState())
  if (from.name === 'QuotationCreate') {
    if (store.getPageBackState()) {
      store.setPageBackState(false)
      return next()
    } else {
      ElMessageBox.confirm('确定离开此页面？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          return next()
        })
        .catch(() => {})
    }
  } else {
    return next()
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
