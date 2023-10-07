import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import {
  wmsRequestInterceptor,
  wmsResponseErrorInterceptor,
  wmsResponseInterceptor
} from './requestInterceptor'
// @ts-ignore
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'

interface IAxiosRequestConfig<T> extends AxiosRequestConfig<T> {
  notToken?: boolean // 请求是否携带 token
  showSuccessToast?: boolean // 是否显示成功提示
}
interface IAxiosInstance extends AxiosInstance {
  <T = any, R = AxiosResponse<T>, D = any>(config: IAxiosRequestConfig<D>): Promise<R>
}

export const uploadUrl: string = import.meta.env.VITE_BASE_URL

const request: IAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000
})

request.interceptors.request.use((config) => {
  const appStore = useAppStore()
  appStore.setLoading(true)

  return wmsRequestInterceptor(config, appStore.token)
})

request.interceptors.response.use(
  (response) => {
    const appStore = useAppStore()
    appStore.setLoading(false)

    const { successMessage, errMessage } = wmsResponseInterceptor(response)
    if (successMessage) ElMessage.success(successMessage)
    if (errMessage) {
      ElMessage.error(errMessage)
      if (/token/gi.test(errMessage)) {
        appStore.logout()
      }
    }
    return response
  },
  (err) => {
    const appStore = useAppStore()
    appStore.setLoading(false)

    const errMessage = wmsResponseErrorInterceptor(err)
    if (errMessage) ElMessage.error(errMessage)
    return Promise.reject(err)
  }
)

export default request
