<template>
  <view class="cart-container">
    <my-address></my-address>
    <view class="cart-title">
      <!-- 图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 文本 -->
      <text class="cart-text">购物车</text>
    </view>
    <!-- <my-adress></my-adress> -->
    <!-- 购物车商品列表 -->
    <uni-swipe-action>
      <block v-for="(shopItem, index) in cart" :key="index">
        <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(shopItem)">
          <my-goods :goods="shopItem" :showRadio="true" @radio-change="radioChangeHandler" :showNum="true" @num-change="changeNumberHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 结算 -->
    <my-settle></my-settle>
  </view>
</template>
<script>
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState, mapMutations } from 'vuex';
export default {
  //将badgeMix混入到当前页面中
  mixins: [badgeMix],
  data() {
    return {
      options: [
        {
          text: '删除', //显示的文本
          style: {
            backgroundColor: '#C00000' //按钮的颜色
          }
        }
      ]
    };
  },
  methods: {
    ...mapMutations('cart', ['updateGoodsState', 'updateGoodsNumber', 'removeGoodsById']),
    //更改勾选状态
    radioChangeHandler(e) {
      this.updateGoodsState(e);
    },
    //更改购物车数量
    changeNumberHandler(e) {
      this.updateGoodsNumber(e);
      this.setBadge();
    },
    //删除某商品(点击了滑动操作按钮)
    swipeActionClickHandler(shopItem) {
      this.removeGoodsById(shopItem.goods_id);
    }
  },
  computed: {
    ...mapState('cart', ['cart'])
  }
};
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 5px;
  border-bottom: 1px solid #efefef;
  .cart-text {
    margin-left: 10px;
  }
}
</style>
