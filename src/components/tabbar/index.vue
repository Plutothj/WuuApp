<template>
  <view class="tabbar">
    <nut-tabbar
      unactive-color="#7d7e80"
      @tab-switch="tabSwtich"
      bottom
      v-model="active"
      active-color="#1989fa"
    >
      <nut-tabbar-item tab-title="首页" icon="home"></nut-tabbar-item>
      <nut-tabbar-item tab-title="功能" icon="category"></nut-tabbar-item>
      <nut-tabbar-item tab-title="我的" icon="find"></nut-tabbar-item>
    </nut-tabbar>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
export default {
  name: "Tabbar",
  props: {
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },

  methods: {
    tabSwtich(e, item) {
      console.log(e, item);
      switch (item) {
        case 0:
          Taro.navigateTo({ url: "/pages/index/index" });
          break;
        case 1:
          Taro.navigateTo({ url: "/pages/mainEdit/index" });
          break;
        case 2:
          Taro.redirectTo({ url: "/pages/index/index" });
          break;
        default:
          break;
      }
    },
  },
};
</script>
