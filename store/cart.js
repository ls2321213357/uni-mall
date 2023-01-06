export default {
  //为当前模块开启命名空间
  namespaced: true,
  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  mutations: {
    //添加至购物车
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find((item) => item.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      uni.$showMsg('加入购物车成功！', 'success')
      this.commit('cart/saveToStorage')
    },
    //保存到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    //更新购物车勾选状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find((item) => item.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('cart/saveToStorage')
      }
    },
    //更新购物车单个商品的数量
    updateGoodsNumber(state, goods) {
      const finResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (finResult) {
        finResult.goods_count = goods.goods_count
        this.commit('cart/saveToStorage')
      }
    },
    //删除购物车某个商品
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(item => item.goods_id !== goods_id)
      this.commit('cart/saveToStorage')
    },
    //更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach(item => item.goods_state = newState)
      this.commit('cart/saveToStorage')
    }
  },
  getters: {
    //购物车的商品总数
    cartTotal(state) {
      let cartNum = 0;
      state.cart.forEach((goods) => {
        cartNum += goods.goods_count
      })
      return cartNum
    },
    // 勾选的商品总数
    checkedCount(state) {
      return state.cart.filter((item) => item.goods_state).reduce((cartTotal, item) => cartTotal += item.goods_count, 0)
    },
    // 已勾选的商品价格
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      return state.cart.filter((item) => item.goods_state).reduce((total, item) => total += item.goods_count * item
        .goods_price, 0).toFixed(2)
    }
  }
}
