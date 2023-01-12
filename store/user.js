export default {
  namespaced: true,
  state: () => ({
    //地址信息
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    //token信息
    token: uni.getStorageSync('token') || '',
    //用户的基本信息
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    //重定向的信息
    redirectInfo: {}
  }),
  mutations: {
    //更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('user/saveAddressToStorage')
    },
    // 收货地址保存到本地
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    //更新用户信息
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
      this.commit('user/saveUserInfoToStorage')
    },
    // 用户信息保存到本地
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    //更新token字符串
    updataToken(state, token) {
      state.token = token
      this.commit('user/saveTokenToStorage')
    },
    //把token存储到本地
    saveTokenToStorage(state) {
      uni.setStorageSync('token', JSON.stringify(state.token))
    },
    updateRedirectInfo(state, redirectInfo) {
      state.redirectInfo = redirectInfo
    },
  },
  getters: {
    //收货地址信息
    addStr(state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    },
  }
}
