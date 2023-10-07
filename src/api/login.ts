import request from '@/utils/request'

// 登录
export function requestLogin(params: any) {
  return request({
    url: '/api-uaa/oauth/user/token',
    method: 'post',
    params,
    notToken: true,
    showSuccessToast: true
  })
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/api-user/user/userInfo',
    method: 'get'
  })
}

// 查询列表(用于测试)
export function getQuoteOrderList(params: any) {
  return request({
    url: '/order/quoteorder/list',
    method: 'get',
    params
  })
}