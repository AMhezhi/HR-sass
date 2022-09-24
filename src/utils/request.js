import axios from 'axios'
import { Message } from 'element-ui'
// create an axios instance
const service = axios.create({
  // 当执行 npm run dev => .env.developement => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 超时时间
})
// 请求拦截器
service.interceptors.request.use()
// response interceptor-响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message) // 提示错误信息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误,让当前的执行链跳出成功,直接进入 catch
}
)

export default service
