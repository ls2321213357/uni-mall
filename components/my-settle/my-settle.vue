<template>
  <view class="my-settle-container" v-if="cart.length !== 0">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio :checked="isFullChecked" color="#C00000" />
      <text>全选</text>
    </label>
    <!-- 合计区域-->
    <view class="amout-box">
      合计:
      <text class="amount">￥{{ checkedGoodsAmount }}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{ checkedCount }})</view>
  </view>
  <view class="empty-cart" v-else>
    <image src="@/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
export default {
  name: 'my-settle',
  data() {
    return {
      seconds: 3,
      // 定时器
      timer: null
    };
  },
  methods: {
    ...mapMutations('cart', ['updateAllGoodsState']),
    ...mapMutations('user', ['updateRedirectInfo']),
    //更改全选状态
    changeAllState() {
      this.updateAllGoodsState(!this.isFullChecked);
    },
    // 点击结算按钮
    settlement() {
      //判断是否勾选了产品
      if (!this.checkedCount) return uni.$showMsg('请勾选结算商品');
      //判断是否填写了收货地址
      if (!this.addStr) return uni.$showMsg('请输入收货地址');
      if (!this.token) return this.delayNavigate();
      //实现微信支付
      this.payOrder();
    },
    //展示倒计时的提示消息
    showTips(n) {
      uni.showToast({
        icon: 'none',
        title: '登陆后即可进行结算' + n + '秒后自动跳转登录',
        mask: true, //方式点击穿透
        duration: 1500 //1.5s后关闭
      });
    },
    //进行登录部分tabbar的跳转
    delayNavigate() {
      this.seconds = 3;
      //展示秒数倒计时提示信息
      this.showTips(this.seconds);
      this.timer = setInterval(() => {
        this.seconds--;
        if (this.seconds <= 0) {
          clearInterval(this.timer);
          uni.switchTab({
            url: '/pages/my/my',
            success: () => {
              this.updateRedirectInfo({
                openType: 'switchTab',
                from: '/pages/cart/cart'
              });
            }
          });
          return;
        }
        this.showTips(this.seconds);
      }, 1000);
    },
    //微信支付
    async payOrder() {
      //封装信息对象
      const orderInfo = {
        //订单写死成一分钱
        order_price: 0.01,
        consignee_addr: this.addStr,
        goods: this.cart.filter(item => item.goods_state).map(item => ({ goods_id: item.goods_id, goods_number: item.goods_count, goods_price: item.goods_price }))
      };
      //发起订单请求
      const { data: result } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
      console.log(result);
      if (result.meta.status !== 200) return uni.$showMsg('创建订单失败');
      const orderNumber = result.message.order_number;
      //订单预支付
      const { data: result2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber });
      console.log(result2);
      if (result2.meta.status !== 200) return uni.$showMsg('预付订单生成失败');
      //得到订单支付相关的必要参数
      const payInfo = result2.message.pay;
      //发起支付
      const [err, succ] = await uni.requestPayment(payInfo);
      if (err) return uni.$showMsg('订单支付失败');
      const { data: result3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber });
      //检测订单是未支付
      if (result3.meta.status !== 200) return uni.$showMsg('订单未支付');
      //检测订单支付完成
      uni.showToast({
        title: '订单支付完成',
        icon: 'success'
      });
    }
  },
  computed: {
    ...mapGetters('cart', ['checkedCount', 'cartTotal', 'checkedGoodsAmount']),
    ...mapGetters('user', ['addStr']),
    ...mapState('cart', ['cart']),
    ...mapState('user', ['token']),
    //是否全选
    isFullChecked() {
      return this.cartTotal === this.checkedCount && this.cartTotal !== 0;
    }
  }
};
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  font-size: 14px;
  .radio {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .amount {
    color: #c00000;
  }
  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
