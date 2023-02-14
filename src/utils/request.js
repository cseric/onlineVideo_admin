import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const domain = 'http://localhost:9096'
// 请求基础地址
export const baseURL = domain + '/api/v1'
// 头像资源地址
export const avatarURL = domain + '/res/avatar/'
// 封面资源地址
export const coverURL = domain + '/res/cover/'
// 视频资源地址
export const videoURL = domain + '/res/video/'
// 封装axios请求
const ApiRequest = axios.create({
  baseURL
})

// 请求白名单，不需要携带token
const whiteAPIList = ['/admin/login']

// 请求拦截器
ApiRequest.interceptors.request.use(function (config) {
  if (!whiteAPIList.includes(config.url)) {
    config.headers.Authorization = store.state.adminToken
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
ApiRequest.interceptors.response.use(function (response) {
  return response
}, function (error) {
  // 未授权
  if (error.response.status === 401) {
    // token有效，没有足够的权限
    if (error.response.data.code === 4001) {
      Message.error('权限不足')
      router.replace('/').catch((err) => err)
      return
    }
    // token过期
    store.commit('removeAdminInfo')
    store.commit('removeToken')
    Message.error('用户授权已过期')
    router.replace('/login').catch((err) => err)
  }
  return Promise.reject(error)
})

export default ApiRequest
