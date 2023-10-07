import type { Router } from 'vue-router'

/**
 * 路由注意事项：子路由不能以 "/"" 开头，否则路由匹配会有问题
 */
export const permissionRoutesCreator = () => [
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/index',
    component: () => import('../components/Layout/LayoutWrapper.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: 'index',
        name: 'HomeIndex',
        component: () => import('../views/Home/HomeIndex.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/quotationManages',
    name: 'QuotationManages',
    redirect: '/quotationManages/demandManageList',
    component: () => import('../components/Layout/LayoutWrapper.vue'),
    meta: { title: '报价管理' },
    children: [
      {
        path: 'demandManageList',
        name: 'DemandManageList',
        component: () => import('@/views/QuotationManages/DemandManage/DemandManageList.vue'),
        meta: { title: '需求管理' },
        children: [
          {
            path: 'quotationCreate',
            name: 'QuotationCreate',
            component: () => import('@/views/QuotationManages/DemandManage/QuotationCreate.vue'),
            meta: { title: '开始报价', hidden: true }
          }
        ]
      },
      {
        path: 'quoteList',
        name: 'QuoteList',
        component: () => import('@/views/QuotationManages/QuoteManage/QuoteList.vue'),
        meta: { title: '报价单管理' }
      }
    ]
  }
]

/**
 * 动态添加路由
 * @param router 路由对象
 * @param routesInfo 后端路由信息列表
 * @returns
 */
export const addRoutes = (router: Router, routesInfo: any) => {
  // 将后端数据字典化
  function mapRoutesInfo(routesInfo: any) {
    const map = new Map()
    routesInfo.forEach((item: any) => {
      map.set(item.url, item.button)
    })
    return map
  }
  // 拼接各级路由地址
  function getFullPath(route: any, url: string = '') {
    const hasPrefix = route.path.indexOf('/') === 0
    console.log(hasPrefix)
    console.log(url)
    route.fullPath = `${url === '/' ? '' : url}${hasPrefix ? route.path : '/' + route.path}`
    console.log(route.fullPath)
    if (route.children && route.children.length) {
      route.children.forEach((r: any) => getFullPath(r, route.fullPath))
    }
  }
  // 通过 fullPath 字段，递归过滤路由
  function filterRoutes(routes: any) {
    console.log(routes)
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      console.log(routes[i])
      console.log(route.fullPath)
      if (!routesInfoMap.has(route.fullPath)) {
        console.log(!routesInfoMap.has(route.fullPath))
        routes.splice(i, 1)
        i--
        break
      }
      if (route.children && route.children.length) {
        filterRoutes(route.children)
      }
    }
  }

  // 获取后端路由 map
  const routesInfoMap = mapRoutesInfo(routesInfo)
  console.log(routesInfoMap)
  // 拼接各级路由地址 fullPath
  const permissionRoutes = permissionRoutesCreator()
  permissionRoutes.forEach((route: any) => getFullPath(route))
  // 过滤路由
  // if (!import.meta.env.DEV) {
  //   filterRoutes(permissionRoutes)
  // }
  filterRoutes(permissionRoutes)
  // 添加路由
  console.log(permissionRoutes)
  permissionRoutes.forEach((route: any) => {
    router.addRoute(route)
  })
  router.addRoute({ path: '/:other*', redirect: '/login' })
  // 返回筛选后的路由，用于侧边栏菜单渲染
  return permissionRoutes
}
