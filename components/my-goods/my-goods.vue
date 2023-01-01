<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left"><image :src="good.goods_small_logo || defaultPic" class="goods-pic"></image></view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <view class="goods-name">{{ good.goods_name }}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-pic">￥{{ good.goods_price.toFixed() }}</view>
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
    good: {
      default: {},
      type: Object
    }
  }
};
</script>

<style lang="scss">
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left {
    margin-right: 5px;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .goods-name {
      font-size: 13px;
    }
    .goods-pic {
      color: #c00000;
      font-size: 16px;
    }
  }
}
</style>
