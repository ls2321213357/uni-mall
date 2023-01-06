//设置tabbar徽标
import {
  mapGetters
} from 'vuex';
export default {
  computed: {
    ...mapGetters('cart', ['cartTotal'])
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.cartTotal + ''
      })
    }
  },
  onShow() {
    this.setBadge()
  }
}
