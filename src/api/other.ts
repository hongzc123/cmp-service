import request from '@/utils/request'

// 文件下载列表状态
export function fileStatus(data: any) {
  return request({
    url: '/admin/filedown/list',
    method: 'get',
    params: data
  })
}

// 文件生成
export function fileCreate(data: any) {
  return request({
    url: '/admin/filedown/sava',
    method: 'get',
    params: data
  })
}

// 文件删除
export function fileDel(data: any) {
  return request({
    url: '/admin/filedown/delete',
    method: 'get',
    params: data
  })
}
