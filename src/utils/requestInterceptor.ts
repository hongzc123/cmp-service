/**
 * 请求前的拦截器
 * @param {Object} config - 配置对象
 * @param {String} token - 用户token
 * @returns {Object} 配置对象
 */
export const wmsRequestInterceptor = (config: any, token?: string) => {
  config.headers['Authorization'] = 'Basic ' + btoa('wms' + ':' + 'wms')
  if (token) {
    config.headers['access_token'] = token
    if (!config.notToken && (config.method === 'post' || config.method === 'get')) {
      if (!config.params) config.params = {}
      config.params['access_token'] = token
    }
  }
  return config
}

/**
 * 正常响应的拦截器
 * @param {Object} response - 响应对象
 * @returns {Object} 响应数据
 */
export const wmsResponseInterceptor = (response: any) => {
  const { data, config } = response
  if (data.resp_code !== 0) return { errMessage: data.resp_msg, successMessage: '' }
  return { errMessage: '', successMessage: config.showSuccessToast ? data.resp_msg : '' }
}

/**
 * HTTP 错误响应的拦截器
 * @param {Object} error - 错误对象
 * @returns {String} 错误信息
 */
export const wmsResponseErrorInterceptor = (error: any) => {
  const { status, resp_msg, message } = error.response.data
  if (/token/gi.test(resp_msg) || /token/gi.test(message)) {
    return '登录已过期，请重新登录'
  } else if (status === 401) {
    return resp_msg
  } else if (status === 504) {
    return '网络连接超时，请稍后再试'
  } else {
    return message || resp_msg
  }
}
