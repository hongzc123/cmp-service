import { getLocalStorage, setLocalStorage } from 'cmpanda-util'
import type { Ref } from 'vue'

export const ASYNC_ROUTES = 'ASYNC_ROUTES'
export const TOKEN = 'TOKEN'
export const USER_INFO = 'USER_INFO'

/**
 * 通用的store set方法
 * @param ref 对应的ref
 * @param key 本地存储的键名
 * @param payload 要设置的值
 */
export const commonStoreSet = (ref: Ref<any>, key: string, payload: any) => {
  ref.value = payload
  setLocalStorage(key, JSON.stringify(payload))
}

/**
 * 通用的store get方法 
 * @param ref 对应的ref
 * @param key 本地存储的键名
 */
export const commonStoreGet = (ref: Ref<any>, key: string) => {
  const res = getLocalStorage(key)
  if (res) ref.value = res
  return ref.value
}