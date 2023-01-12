<template>
  <view class="my-container">
    <!-- 未登录时 -->
    <my-login v-if="!token"></my-login>
    <!-- 登陆时 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
import badgeMix from '@/mixins/tabbar-badge.js';
import { mapState } from 'vuex';
export default {
  mixins: [badgeMix],
  data() {
    return {};
  },
  computed: {
    ...mapState('user', ['token'])
  }
};
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>
