import Vue from 'vue'
import Vuex from 'vuex'
//导入各个功能的vuex
import cart from './cart.js'
import user from './user.js'
//将vuex安装为vue的插件
Vue.use(Vuex)
//创建store的实例对象
const store = new Vuex.Store({
  //挂载store模块
  modules: {
    cart,
    user,
  }
})
//向外共享store
export default store;
