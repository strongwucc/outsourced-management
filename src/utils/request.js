import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import router from '@/router'
import { baseApi } from '@/utils/env'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    // 更新access_token
    if (router.currentRoute.fullPath.indexOf('login') === -1) {
      const { Authorization } = response.config.headers
      if (Authorization) {
        store.commit('user/SET_TOKEN', Authorization)
        setToken(Authorization)
      }
    }

    const res = response.data

    if (response.status !== 200) {
      // Message({
      //   message: res.message || '哎呀，系统开小差啦',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      MessageBox.alert(res.message || '哎呀，系统开小差啦', '提示')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 200) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  (error) => {
    console.log('response', error.response)

    if (error.response.status === 401) {
      if (router.currentRoute.fullPath.indexOf('login') === -1) {
        const backtoUrl = encodeURIComponent(router.currentRoute.fullPath)
        store.dispatch('user/resetToken')
        router.push('/login?redirect=' + backtoUrl)
      }
    } else {
      // Message({
      //   message: '哎呀，系统出错啦',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      MessageBox.alert('系统出错，请联系供应商管理部', '提示')
    }

    return Promise.reject(error)
  }
)

export default service
