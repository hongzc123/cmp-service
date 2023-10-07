/**
 * 静态路由
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/LoginIndex.vue')
  }
]

/**
 * 匹配静态路由
 * @param path 
 * @returns 
 */
export const matchConstantRoute = (path: string) =>
  constantRoutes.find((item) => item.path === path)
