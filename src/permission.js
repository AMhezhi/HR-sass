// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // 引入store实例
import nProgress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css' // 引入进度条样式

// 不需要导出 因为只需要让代码执行即可
// 前置守卫
// next是前置守卫必须执行的钩子函数 next必须执行 如果不执行 页面就死了
// next()放过
// next(false)跳转终止
// next(地址)跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach(async(to, from, next) => {
  nProgress.start() // 开启进度条的意思
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      next('/') // 跳到主页
    } else {
      // 只有放过的时候才去获取用户资料
      // 如果当前vuex中有用户资料的id表示已经有资料了.不需要获取了 ,如果没有id才需要获取
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
      }
      next()
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 表示要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()// 解决手动切换地址进度条不关闭
})
// 后置守卫
router.afterEach(() => {
  nProgress.done()// 关闭进度条
})
