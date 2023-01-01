<template>
  <view class="search-box">
    <uni-search-bar @input="inputMsg" cancelButton="none" :radius="100"></uni-search-bar>
    <!-- 搜索建议 -->
    <view class="history-box" v-if="searchHistoryList.length !== 0">
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clearSearchHistory"></uni-icons>
      </view>
      <view class="history-list">
        <!-- 列表区域 -->
        <uni-tag v-for="(historyItem, index) in historys" :key="index" :circle="true" :text="historyItem" @click="gotoGoodsList(historyItem)"></uni-tag>
      </view>
    </view>
    <!-- 搜索结果 -->
    <view class="sugg-list">
      <view class="sugg-item" v-for="(sugg, index) in searchResultList" :key="index" @click="gotoGoodsDetail(sugg.goods_id)">
        <view class="goods-name">{{ sugg.goods_name }}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      //防抖
      timer: null,
      //输入信息
      keyVal: '',
      //搜索结果列表
      searchResultList: [],
      //历史搜索
      searchHistoryList: []
    };
  },
  methods: {
    //输入关键字进行记录
    inputMsg(value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        //如果500毫秒没有输入新的事件,则为关键字赋值
        this.keyVal = value;
        if (this.searchHistoryList.length >= 10) {
          this.searchHistoryList.pop();
          this.searchHistoryList.shift(value);
        } else {
          this.saveSearchHistory();
        }
        this.getSearchList();
      }, 500);
    },
    //保存搜索关键词的方法
    saveSearchHistory() {
      // 1. 将 Array 数组转化为 Set 对象
      const set = new Set(this.searchHistoryList);
      // 2. 调用 Set 对象的 delete 方法，移除对应的元素
      set.delete(this.keyVal);
      // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
      set.add(this.keyVal);
      // 4. 将 Set 对象转化为 Array 数组
      this.searchHistoryList = Array.from(set);
      // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
      uni.setStorageSync('keyVal', JSON.stringify(this.searchHistoryList));
    },
    //对关键字进行搜索
    async getSearchList() {
      if (this.keyVal == '') {
        this.searchResultList = [];
        return;
      } else {
        const { data: result } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.keyVal });
        if (result.meta.status !== 200) {
          return uni.$showMsg();
        } else {
          if (result.message.length == 0) {
            return uni.showToast({
              icon: 'error',
              title: '抱歉暂无该商品'
            });
          } else {
            this.searchResultList = result.message;
          }
        }
      }
    },
    //点击调转到商品详情页面
    gotoGoodsDetail(goodId) {
      uni.navigateTo({
        url: '/subpkg/goods_detail/goods_detail?goods_id=' + goodId
      });
    },
    //清空搜索历史
    clearSearchHistory() {
      this.searchHistoryList = [];
      //清空本地存储
      uni.setStorageSync('keyVal', '[]');
    },
    //点击搜索历史记录
    gotoGoodsList(keyVal) {
      uni.navigateTo({
        url: '/subpkg/goods_list/goods_list?query=' + keyVal
      });
    }
  },
  onLoad() {
    this.searchHistoryList = JSON.parse(uni.getStorageSync('keyVal')) || [];
  },
  computed: {
    historys() {
      // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
      // 而是应该新建一个内存无关的数组，再进行 reverse 反转
      return [...this.searchHistoryList].reverse();
    }
  }
};
</script>

<style lang="scss">
//搜索输入框部分
.search-box {
  position: sticky;
  top: 0;
  z-index: 20;
}
//搜索历史部分
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    height: 40px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin: 0 5px;
      display: inline-block;
    }
  }
}
//搜索结果部分
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    width: 100%;
    height: 40px;
    font-size: 16px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-name {
      //文字不允许换行
      white-space: nowrap;
      overflow: hidden;
      //文本溢出后用...代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
</style>
