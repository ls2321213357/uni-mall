<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view scroll-y class="left-scroll-view" :style="{ height: wh + 'px' }">
        <block v-for="(cate, index) in cateList" :key="index">
          <view class="left-scroll-view-item" :class="index === active ? 'active' : ''" @click="changeActive(index)">{{ cate.cat_name }}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view scroll-y class="right-scroll-view" :style="{ height: wh + 'px' }" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item, index) in cateListItem" :key="index">
          <!-- 右侧滚动标题 -->
          <view class="cate-lv2-title">/ {{ item.cat_name }} /</view>
          <!-- 三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三类分类item项 -->
            <view class="cate-lv3-item" v-for="(item3, index3) in item.children" :key="index3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon.replace('dev', 'web')"></image>
              <!-- 文本 -->
              <text>{{ item3.cat_name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 动态计算窗口的剩余高度
      wh: 0,
      //当前被选中的索引
      active: 0,
      //滚动条到顶部的距离
      scrollTop: 0,
      //分类数据列表
      cateList: [],
      //二级分类列表
      cateListItem: []
    };
  },
  onLoad() {
    //获取当前系统的信息
    const sysInfo = uni.getSystemInfoSync();
    //为wh窗口可用高度动态赋值
    this.wh = sysInfo.windowHeight;
    //获取分类信息列表
    this.getCateList();
  },
  methods: {
    //获取分类数据
    async getCateList() {
      const { data: result } = await uni.$http.get('/api/public/v1/categories');
      if (result.meta.status !== 200) {
        return uni.$showMsg();
      } else {
        this.cateList = result.message;
        this.cateListItem = result.message[0].children;
      }
    },
    //改变选中项
    changeActive(index) {
      this.active = index;
      this.cateListItem = this.cateList[index].children;
      //让scrollTop的值在0-1之间切换
      this.scrollTop = this.scrollTop === 0 ? 1 : 0;
    },
    //调转到商品详情页面
    gotoGoodsList(item3) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?cid=' + item3.cat_id
      });
    }
  }
};
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      line-height: 60px;
      text-align: center;
      background-color: #f7f7f7;
      font-size: 12px;
      //激活项样式
      &.active {
        background-color: #fff;
        position: relative;
        //渲染激活项左侧红色指示边线
        &::before {
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
.cate-lv2-title {
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
}
.cate-lv3-list {
  display: flex;
  flex-wrap: wrap;
  .cate-lv3-item {
    width: 33.3%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    image {
      width: 60px;
      height: 60px;
    }
    text {
      font-size: 12px;
    }
  }
}
</style>
