<template>
  <div class="contaier">
    <nut-tabs
      background="#cfe4ff"
      v-model="value"
      color="#a7bae5"
      title-scroll
      direction="vertical"
    >
      <nut-tabpane title="零食">
        <nut-card
          img-url="//img10.360buyimg.com/n2/s240x240_jfs/t1/210890/22/4728/163829/6163a590Eb7c6f4b5/6390526d49791cb9.jpg!q70.jpg"
          title="香酥米"
          price="100"
          vip-price=""
          :is-need-price="false"
          shopName="田橘子的自营店"
        >
          <template #prolist>
            <div class="search_prolist_attr">100积分</div>
          </template>
          <template #shop-tag>
            <div class="customize">
              <nut-button color="#a7bae5" size="mini" type="info"
                >兑换</nut-button
              >
            </div>
          </template>
        </nut-card>
      </nut-tabpane>
      <nut-tabpane title="券"> </nut-tabpane>
      <nut-tabpane title="抽奖"> </nut-tabpane>
    </nut-tabs>
    <nut-toast msg="新增成功" v-model:visible="show" type="success" />
  </div>
</template>

<script>
import "./index.scss";
import Taro from "@tarojs/taro";
import { Toast } from "@nutui/nutui-taro";
const db = wx.cloud.database();
export default {
  name: "task-add",
  data() {
    return {
      value: "0",
      categoryInfo: {},
      category: [{}],
      categoryChild: [{}],
    };
  },
  mounted() {
    this.getList();
  },
  components: {},
  methods: {
    getList() {
      let that = this;
      db.collection("goods_list")
        .get()
        .then((res) => {
          console.log(res);
          if (res.data) {
            const { categoryInfo, categoryChild } = res.data[0];
            that.categoryInfo = categoryInfo;
            that.category = categoryInfo.category;
            that.categoryChild = categoryChild;
          }
        });
    },
    change() {},
    onChange() {},
  },
};
</script>
