import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 token持久化 => 放到缓存中
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 将vuex数据清空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, userInfo) {
    // 更新一个对象
    state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    console.log(data)
    // 设置token
    context.commit('setToken', result)
    // 拿到token说明登录成功
    setTimeStamp() // 设置当前的时间戳
  },
  // 获取用户资料action
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    // 获取用户详情
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    // 此时已经获取到了用户的基本资料 迫不得已 为了头像再次调用一个接口
    context.commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
    return result // 这里为什么要return 这是为后期做权限的时候 留下伏笔
  },
  // 登出的功能
  logout(context) {
    // 删除token
    context.commit('removeToken')// 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo')// 删除用户信息
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

