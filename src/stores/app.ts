import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ASYNC_ROUTES, TOKEN, USER_INFO, commonStoreGet, commonStoreSet } from './util'
import { getInfo, requestLogin } from '@/api/login'
import { addRoutes } from '@/router/permissionRoutes'
import { useRouter } from 'vue-router'

export const useAppStore = defineStore('app', () => {
  const router = useRouter()

  // Loading
  const loading = ref(false)
  const setLoading = (payload: boolean) => {
    loading.value = payload
  }

  // token
  const token = ref('')
  const setToken = (payload: any) => {
    commonStoreSet(token, TOKEN, payload)
  }
  const getToken = () => {
    return commonStoreGet(token, TOKEN)
  }

  // 后端动态路由
  const asyncRoutes = ref([])
  const setAsyncRoutes = (payload: any) => {
    commonStoreSet(asyncRoutes, ASYNC_ROUTES, payload)
  }
  const getAsyncRoutes = () => {
    return commonStoreGet(asyncRoutes, ASYNC_ROUTES)
  }
  // 前端渲染路由(不需要存本地)
  const routes: any = ref([])

  // 用户信息
  const userInfo = ref<{ [key: string]: string }>({})
  const setUserInfo = (payload: any) => {
    commonStoreSet(userInfo, USER_INFO, payload)
  }
  const getUserInfo = () => {
    return commonStoreGet(userInfo, USER_INFO)
  }

  // 登录
  const login = async (form: any) => {
    // 获取token和路由
    const res: any = await requestLogin(form)
    const { access_token, routerInfoList } = res.data.datas
    setToken(access_token)
    setAsyncRoutes(routerInfoList)
    routes.value = addRoutes(router, routerInfoList)
    // 获取用户信息
    const userInfo = await getInfo()
    setUserInfo(userInfo)
    // 跳转到首页
    router.replace({ name: 'Home' })
  }

  // 登出
  const logout = () => {
    setToken('')
    setAsyncRoutes([])
    setUserInfo({})
    // 跳转到登陆页
    router.replace({ name: 'Login' })
  }

  // 页面进入和刷新初始化
  const init = async () => {
    token.value = getToken()
    userInfo.value = getUserInfo()
    asyncRoutes.value = getAsyncRoutes()
    routes.value = addRoutes(router, asyncRoutes.value)
  }

  const backState = ref(false)
  const setPageBackState = (state: boolean) => {
    commonStoreSet(backState, 'BACK_STATE', state)
  }

  const getPageBackState = () => {
    return commonStoreGet(backState, 'BACK_STATE')
  }

  return {
    loading,
    setLoading,
    routes,
    asyncRoutes,
    setAsyncRoutes,
    getAsyncRoutes,
    token,
    setToken,
    getToken,
    login,
    logout,
    userInfo,
    setUserInfo,
    getUserInfo,
    init,
    setPageBackState,
    getPageBackState
  }
})
