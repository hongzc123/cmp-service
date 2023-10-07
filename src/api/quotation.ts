import request from '@/utils/request'

// 需求列表
export function queryIntentionList(params: any) {
  return request({
    url: '/order/quoteorder/queryIntentionList',
    method: 'get',
    params
  })
}

// 报价单需求状态修改
export function changePurchaseIntentionStatus(params: any) {
  return request({
    url: '/order/quoteorder/changePurchaseIntentionStatus',
    method: 'get',
    params
  })
}

// 创建报价
export function quoteSubmit(data: any) {
  return request({
    url: '/order/quoteorder/quoteSubmit',
    method: 'post',
    data
  })
}

// 报价单需求详情
export function getPurchaseIntentionDetail(params: any) {
  return request({
    url: '/order/quoteorder/getPurchaseIntentionDetail',
    method: 'get',
    params
  })
}

// 报价单列表
export function quoteOrderList(params: any) {
  return request({
    url: '/order/quoteorder/quoteOrderList',
    method: 'get',
    params
  })
}

// 报价单详情
export function quoteOrderDetail(params: any) {
  return request({
    url: '/order/quoteorder/detail',
    method: 'get',
    params
  })
}

//
export function getLogisticsConfigTh(params: any) {
  return request({
    url: '/app/public/getLogisticsConfigTh',
    method: 'get',
    params
  })
}

// 报价驳回原因
export function quoteRejectReasonList(query: any) {
  return request({
    url: '/app/public/getDicByCode',
    method: 'get',
    params: query
  })
}

// 需求单导出
export function exportIntentionList(query: any) {
  return request({
    url: '/admin/export/exportIntentionList',
    method: 'get',
    params: query
  })
}

// 报价单导出
export function exportQuoteOrderList(query: any) {
  return request({
    url: '/admin/export/exportQuoteOrderList',
    method: 'get',
    params: query
  })
}
