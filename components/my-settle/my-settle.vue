<template>
  <view class="my-settle-container" v-if="cart.length !== 0">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio :checked="isFullChecked" color="#C00000" />
      <text>全选</text>
    </label>
    <!-- 合计区域-->
    <view class="amout-box">
      合计:
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{ checkedCount }})</view>
  </view>
  <view class="empty-cart" v-else>
    <image src="@/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {};
  },
  methods: {
    ...mapMutations('cart', ['updateAllGoodsState']),
    changeAllState() {
      this.updateAllGoodsState(!this.isFullChecked);
    }
  },
  computed: {
    ...mapGetters('cart', ['checkedCount', 'cartTotal', 'checkedGoodsAmount']),
    //是否全选
    isFullChecked() {
      return this.cartTotal === this.checkedCount && this.cartTotal !== 0;
    }
  }
};
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  font-size: 14px;
  .radio {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .amount {
    color: #c00000;
  }
  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
