<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <view class="tips-text">登陆后即可获得更多权益</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'my-login',
  data() {
    return {};
  },
  methods: {
    ...mapMutations('user', ['updateUserInfo', 'updataToken', 'updateRedirectInfo']),
    //获取用户信息
    getUserProfile() {
      uni.getUserProfile({
        desc: '授权登录后可进行更多操作',
        success: res => {
          this.updateUserInfo(res.userInfo);
          this.getToken(res);
        },
        fail: () => console.log('您取消了授权')
      });
    },
    //获取永久的token
    async getToken(info) {
      const [err, res] = await uni.login().catch(err => err);
      //判断是否wx.login()调用失败
      if (err || res.errMsg !== 'login:ok') return uni.$showMsg('授权失败！');
      //封装参数对象
      const query = {
        code: res.code,
        encryptedData: info.encryptedData,
        iv: info.iv,
        rawData: info.rawData,
        signature: info.signature
      };
      //获得token
      const { data: result } = await uni.$http.post('/api/public/v1/users/wxlogin', query);
      if (result.meta.status !== 400) return uni.$showMsg('登陆失败请重试');
      this.updataToken('liushuodashuaige');
      uni.$showMsg('登陆成功！');
      this.navigateBack();
    },
    //回到未登录的页面
    navigateBack() {
      // redirectInfo 不为 null，并且导航方式为 switchTab
      if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
        uni.switchTab({
          url: this.redirectInfo.from,
          complete: () => {
            this.updateRedirectInfo(null);
          }
        });
      }
    }
  },
  computed: {
    ...mapState('user', ['redirectInfo'])
  }
};
</script>

<style lang="scss">
.login-container {
  //登录盒子样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  // 绘制登录盒子底部的半椭圆造型
  overflow: hidden;
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 40px;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
