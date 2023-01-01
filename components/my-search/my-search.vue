<template>
  <view class="my-search-container" :style="{ 'background-color': bgcolor }" @click="searchBoxHandler">
    <view class="my-search-box" :style="{ 'border-radius': boxRadius + 'px' }">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'my-search',
  data() {
    return {};
  },
  props: {
    //可以自定义颜色和圆角弧度
    bgcolor: {
      type: String,
      default: '#C00000'
    },
    boxRadius: {
      type: Number,
      default: 18
    }
  },
  methods: {
    //点击模拟了input输入框
    searchBoxHandler() {
      //触发父级通过@click绑定的click事件处理函数
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.my-search-box {
  width: 90%;
  height: 36px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>
