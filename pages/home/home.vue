<template>
  <view>
    <view class="search-box">
      <!-- 自定义的搜索组件 -->
      <my-search :bgcolor="'#C00000'" :boxRadius="17" @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图部分 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id"><img :src="item.image_src" /></navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航部分 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(nav, index) in categoryList" :key="index" @click="navClickHandler(nav)"><img :src="nav.image_src" class="nav-img" /></view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层项 -->
      <view v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片 -->
        <view class="floor-img-box">
          <!-- 左侧大图片部分 -->
          <navigator class="left-img-box" :url="item.product_list[0].navigator_url">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix" />
          </navigator>
          <!-- 右侧小图片部分 -->
          <view class="right-img-box">
            <navigator :url="item2.navigator_url" v-for="(item2, index2) in item.product_list" :key="index2" v-if="index2 !== 0" class="right-img-item">
              <image :src="item2.image_src" :style="{ width: item2.image_width + 'rpx' }" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js';
export default {
  mixins: [badgeMix],
  data() {
    return {
      //轮播图数据
      swiperList: [],
      //分类选项数据
      categoryList: [],
      //楼层数据
      floorList: []
    };
  },
  onLoad() {
    //请求轮播图数据
    this.getSwiperList();
    //请求分类选项数据
    this.getCategoryList();
    //请求楼层数据
    this.getFloorList();
  },
  methods: {
    //请求轮播图数据
    async getSwiperList() {
      const { data: result } = await uni.$http.get('/api/public/v1/home/swiperdata');
      if (result.meta.status !== 200) {
        return uni.$showMsg();
      } else {
        this.swiperList = result.message;
      }
    },
    //请求分类选项数据
    async getCategoryList() {
      const { data: result } = await uni.$http.get('/api/public/v1/home/catitems');
      if (result.meta.status !== 200) {
        return uni.$showMsg();
      } else {
        this.categoryList = result.message;
      }
    },
    //点击切换页面
    navClickHandler(nav) {
      if (nav.name === '分类') {
        uni.switchTab({
          url: '/pages/cate/cate'
        });
      }
    },
    //获取楼层数据
    async getFloorList() {
      const { data: result } = await uni.$http.get('/api/public/v1/home/floordata');
      if (result.meta.status !== 200) {
        return uni.$showMsg();
      } else {
        //处理url地址
        result.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.navigator_url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
          });
        });
        this.floorList = result.message;
      }
    },
    // 跳转到搜索页面
    gotoSearch() {
      uni.navigateTo({
        url: '/subpkg/search/search'
      });
    }
  }
};
</script>

<style lang="scss">
.search-box {
  //设置定位效果为 '吸顶'
  position: sticky;
  top: 0;
  z-index: 99;
}
// 轮播图样式
swiper {
  height: 330rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}
//分类部分样式
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0px;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
//楼层部分样式
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
