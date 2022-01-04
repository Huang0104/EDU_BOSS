// 引入 axios
import axios from 'axios'
import store from '@/store'
// 引入 router
import router from '@/router'
// 引入 qs
import qs from 'qs'

// 局部引入 Message 组件功能
import { Message } from 'element-ui'

// 用于是否存储正在刷新的 token
let isRefreshing = false
// 存储发送的多个请求
let requests = []

// 自定义配置新建一个 axios 实例
const request = axios.create({})

// 封装 URL 基地址检测函数
function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

// 封装响应拦截器，跳转登录页
function redirectLogin () {
  // 跳转至登录页
  router.push({
    name: 'login',
    query: {
      // 重定向至登录之前的页面
      // currentRoute 表示当前路由对应的配置对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 设置请求拦截器
request.interceptors.request.use(function (config) {
// 根据请求的 URL 判断基地址，设置给 config.baseURL
  config.baseURL = getBaseURL(config.url)
  // console.log(config)
  // 统一设置 Token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 设置响应拦截器
request.interceptors.response.use(function (response) {
// 任何在2xx范围内的状态代码都会触发此功能
  return response
}, function (error) {
  // 任何在2xx范围外的状态代码都会触发此功能
  if (error.response) {
    // 1、处理失败的情况
    const { status } = error.response
    let MessageError = ''
    if (status === 400) {
      MessageError = '请求参数错误，服务器无法理解请求的格式'
    } else if (status === 401) {
      // 原因：
      // 1、 token 不存在
      if (!store.state.user) {
        redirectLogin()
        // 阻止后续操作，向后抛出错误
        return Promise.reject(error)
      }
      // 判断是否有发送刷新请求 ,有将请求挂起,等待 token 刷新完再发送
      if (isRefreshing) {
        // 将发送的请求存储在函数中,等待执行
        return requests.push(() => {
          request(error.config)
        })
      }
      // 没有则刷新 isRefreshing 并发送请求,执行后续操作
      isRefreshing = true
      // 2、 token 无效（错误的 token 、过期的 token）
      // -根据 refresh_token请求新的 refresh_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 检测是否得到新的 access_token
        // 1.没有得到新的 access_token ，跳转回登录页
        if (res.data.state !== 1) {
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 2.得到新的 access_token, 更新到 容器与本地储存
        store.commit('setUser', res.data.content)
        // error.config 是之前失败的配置信息
        // 重新发送 requests 的多次新的失败请求
        requests.forEach(callback => callback)
        // 清空已发送的请求
        requests = []
        // 重新发送本次请求
        return request(error.config)
      }).catch(() => {
        store.commit('setUser', null)
        redirectLogin()
        return Promise.reject(error)
      }).finally(() => {
        // 请求发送，响应成功，token 回到初始状态
        isRefreshing = false
      })
    } else if (status === 403) {
      MessageError = '你没有权限，请与管理员联系'
    } else if (status === 404) {
      MessageError = '找不到资源'
    } else if (status >= 500) {
      MessageError = '服务器错误，请联系管理员'
    }
    Message.error(MessageError)
  } else if (error.request) {
    // 请求成功，响应失败
    Message.error('请求超时，请重试')
  } else {
    // 未知错误
    Message.error('未知错误')
  }
  // 将本次请求的错误向后抛出，让响应请求的处理函数进行操作
  return Promise.reject(error)
})
export default request
