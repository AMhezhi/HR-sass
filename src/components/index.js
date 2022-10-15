// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import langSelect from './lang'
import TagsView from './TagsView'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
    Vue.use(Print)
    Vue.component('ThemePicker', ThemePicker) // 主题切换
    Vue.component('langSelect', langSelect) // 语言切换
    Vue.component('TagsView', TagsView)
  }
}
