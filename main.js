// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//引入请求方法
import {
  $http
} from '@escook/request-miniprogram'
uni.$http = $http
//配置请求根路径
$http.baseUrl = 'https://www.uinav.com'
//请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '加载中......'
  })
  if (options.url.indexOf('/my/') !== -1) {
    //为请求头添加身份认证字段
    options.header = {
      Authorization: store.state.user.token,
    }
  }
}
//响应拦截器
$http.afterRequest = function(options) {
  uni.hideLoading()
}
Vue.config.productionTip = false
//全局封装展示消息提示方法
uni.$showMsg = function(title = '数据加载失败', icon = 'error', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon
  })
}
//引入store
import store from './store/store.js'
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
