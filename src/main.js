import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import ElSelectTree from 'el-select-tree'
import moment from 'moment'

import '@/styles/index.scss' // global css
import './assets/font/iconfont.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/directive/index'

import { baseApi } from './utils/env'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(ElSelectTree)

Vue.config.productionTip = false

Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_API

Vue.prototype.$message.error = function(msg) {
  return ElementUI.MessageBox.alert(msg, '提示')
}

Vue.prototype.$moment = moment

new Vue({
  el: '#app',
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: (h) => h(App)
})
