<template>
  <view class="goods-list">
    <view v-for="(goods, index) in goodsList" :key="index" @click="gotoDetail(goods)"><my-goods :goods="goods" :showRadio="false"></my-goods></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      //商品请求参数对象
      queryInfo: {
        //查询关键词
        query: '',
        //商品id
        cid: 5,
        //页码
        pagenum: 1,
        //每页多少数据
        pagesize: 20
      },
      //商品信息列表
      goodsList: [],
      //商品总数量
      total: 0,
      //进行节流
      isLoading: false
    };
  },
  methods: {
    //获取商品列表
    async getGoodsList(cb) {
      this.isLoading = true;
      const { data: result } = await uni.$http.get('/api/public/v1/goods/search', this.queryInfo);
      this.isLoading = false;
      //只要数据请求完毕就执行cb这个自定的函数
      cb && cb();
      if (result.meta.status !== 200 || result.message.total === 0) {
        return uni.showToast({
          icon: 'error',
          title: '抱歉暂无该商品'
        });
      } else {
        this.goodsList = [...this.goodsList, ...result.message.goods];
        this.total = result.message.total;
      }
    },
    //跳转商品详情页面
    gotoDetail(good) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + good.goods_id
      });
    }
  },
  //监听下拉触底事件
  onReachBottom() {
    const { pagenum, pagesize } = this.queryInfo;
    if (pagenum * pagesize >= this.total) {
      return uni.showMsg('数据加载完毕');
    }
    if (this.isLoading) return;
    //让页码+1
    this.queryInfo.pagenum += 1;
    this.getGoodsList();
  },
  onLoad(options) {
    this.queryInfo.query = options.query || '';
    this.queryInfo.cid = options.cid || '';
    this.getGoodsList();
  },
  //监听下拉刷新
  onPullDownRefresh() {
    //重置数据
    this.queryInfo.pagenum = 1;
    this.total = 0;
    this.isLoading = false;
    this.goodsList = [];
    //重新发起请求
    this.getGoodsList(() => uni.stopPullDownRefresh());
  }
};
</script>

<style lang="scss"></style>
