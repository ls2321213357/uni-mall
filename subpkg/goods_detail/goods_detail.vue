<template>
  <view v-if="goodDetailInfo.goods_name" class="goods-detail-container">
    <!-- 商品轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(banner, index) in swiperList" :key="index"><image :src="banner.pics_big" @click="preview(index)"></image></swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="goods-price">￥{{ goodDetailInfo.goods_price }}</view>
      <!-- 商品信息主题 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{ goodDetailInfo.goods_name }}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="goodsyf">快递:免运费</view>
    </view>
    <rich-text :nodes="goodDetailInfo.goods_introduce" v-if="goodDetailInfo.goods_introduce"></rich-text>
    <view v-else class="goods-error">抱歉暂无其他图片信息</view>
    <view class="goods-nav"><uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"></uni-goods-nav></view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex';
export default {
  data() {
    return {
      //商品详细信息
      goodDetailInfo: {},
      //左侧按钮
      options: [
        {
          icon: 'shop',
          text: '店铺'
        },
        {
          icon: 'cart',
          text: '购物车',
          info: 0
        }
      ],
      //右侧按钮
      buttonGroup: [
        {
          text: '加入购物车',
          backgroundColor: '#ff0000',
          color: '#fff'
        },
        {
          text: '立即购买',
          backgroundColor: '#ffa200',
          color: '#fff'
        }
      ]
    };
  },
  methods: {
    //获取商品详细信息
    async getDetaiInfo(goods_id) {
      const { data: result } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id });
      if (result.meta.status !== 200) {
        return uni.$showMsg('信息加载失败');
      } else {
        result.message.goods_introduce = result.message.goods_introduce.replace(/<img/g, '<img style="display:block;"').replace(/webp/g, 'jpg');
        this.goodDetailInfo = result.message;
      }
    },
    //实现轮播图预览效果
    preview(index) {
      uni.previewImage({
        current: index,
        urls: this.swiperList.map(item => item.pics_big)
      });
    },
    // 左侧点击按钮
    onClick(e) {
      if (e.content.text === '购物车') {
        uni.switchTab({
          url: '/pages/cart/cart'
        });
      } else {
        console.log('进入了商家店铺了');
      }
    },
    //右侧点击按钮
    buttonClick(e) {
      const { goods_id, goods_name, goods_price, goods_small_logo } = this.goodDetailInfo;
      if (e.content.text === '加入购物车') {
        //定义一个商品对象
        const goods = {
          goods_id,
          goods_name,
          goods_price,
          goods_small_logo,
          goods_count: 1,
          goods_state: true
        };
        this.addToCart(goods);
      }
    },
    ...mapMutations('cart', ['addToCart'])
  },
  computed: {
    swiperList() {
      return this.goodDetailInfo.pics;
    },
    // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
    ...mapState('cart', ['cart']),
    ...mapGetters('cart', ['cartTotal'])
  },
  onLoad(optaion) {
    this.getDetaiInfo(optaion.goods_id);
  },
  watch: {
    //监听购物车商品数量,给徽标赋值

    cartTotal: {
      handler(newVal) {
        const findResult = this.options.find(item => item.text === '购物车');
        if (findResult) {
          findResult.info = newVal;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
// 轮播图区域
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
//商品信息区域
.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .goods-price {
    font-size: 18px;
    margin: 10px 0;
    color: #c00000;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
  }
  .goods-name {
    font-size: 13px;
    padding-right: 10px;
  }
  .favi {
    width: 120px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #efefef;
    color: gray;
  }
  .goodsyf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods-detail-container {
  padding-bottom: 50px;
}
.goods-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.goods-error {
  color: #c00000;
  font-size: 16px;
  text-align: center;
}
</style>
