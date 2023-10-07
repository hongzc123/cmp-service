import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

/**
 * 获取远程图片地址
 */
export const getRemoteImage = (imageName: string) => {
  return import.meta.env.VITE_IMAGE_URL + imageName
}

/**
 * @param {*} url
 * @param {*} type 窗口的打开方式
 */
// 文件链接打开
export const openUrl = (url: string, type = '_blank') => {
  // _blank 表示新开一个窗口
  // _parent表示父框架窗口
  // _self表示覆盖该窗口
  window.open(url, type)
}

// 复制
export const handleCopy = (val: string) => {
  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.setAttribute('value', val)
  document.body.appendChild(input)
  input.select()
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    ElMessage.success('复制成功')
  }
  document.body.removeChild(input)
}
