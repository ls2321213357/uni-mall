<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioHandler" />
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <view class="goods-name">{{ goods.goods_name }}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-pic">￥{{ goods.goods_price.toFixed() }}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" v-if="showNum" :value="goods.goods_count" @change="changeGoodsNumber"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-goods',
  data() {
    return {
      //默认图片
      defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
    };
  },
  props: {
    goods: {
      default: {},
      type: Object
    },
    showRadio: {
      default: false,
      type: Boolean
    },
    showNum: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    //更改勾选状态
    radioHandler() {
      this.$emit('radio-change', {
        goods_id: this.goods.goods_id,
        goods_state: !this.goods.goods_state
      });
    },
    //更改购物车数量
    changeGoodsNumber(val) {
      this.$emit('num-change', {
        goods_id: this.goods.goods_id, //商品id
        goods_count: +val //商品最新数量
      });
    }
  }
};
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  //设置盒子模型为border-box
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
    .goods-name {
      font-size: 13px;
    }
    .goods-info-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .goods-pic {
      color: #c00000;
      font-size: 16px;
    }
  }
}
</style>
