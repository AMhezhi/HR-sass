// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import elementJA from 'element-ui/lib/locale/lang/ja'
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
// i18n的选项
  locale: Cookie.get('language') || 'ja', // 从cookie中获取语言类型 获取不到就是中文 // 指的是当前多语言的类型 随意定义字符串类型
  messages: {
    // 语言包
    en: {
      ...elementEN, // 将饿了么的英文语言包引入
      ...customEN
    },
    zh: {
      ...elementZH, // 将饿了么的中文语言包引入
      ...customZH
    },
    ja: {
      ...elementJA
    }
  }
})
