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
          style="margin-bottom: 20px"
          v-for="item in goodsList"
          :key="item._id"
          :img-url="item.goodsImg"
          :title="item.goodsName"
          :price="item.goodsPrice"
          vip-price=""
          :is-need-price="false"
          shopName="田橘子的自营店"
        >
          <template #prolist>
            <div class="search_prolist_attr">{{ item.goodsPrice }}积分</div>
          </template>
          <template #shop-tag>
            <div class="customize">
              <nut-button
                color="#a7bae5"
                @click="
                  handleClick(item.goodsStock, item.goodsPrice, item.goodsName)
                "
                size="mini"
                type="info"
                >兑换</nut-button
              >
            </div>
          </template>
        </nut-card>
      </nut-tabpane>
      <nut-tabpane title="券"> </nut-tabpane>
      <nut-tabpane title="抽奖"> </nut-tabpane>
      <nut-tabpane title="兑换记录">
        <div>
          <nut-cell
            v-for="item in exchangeList"
            :key="item._id"
            :sub-title="`x${item.value}`"
            :title="item.goodsName"
            :desc="`-${item.amount}积分`"
          ></nut-cell>
        </div>
      </nut-tabpane>
    </nut-tabs>
    <nut-toast msg="新增成功" v-model:visible="show" type="success" />
    <nut-toast msg="兑换成功" v-model:visible="show3" type="success" />
    <nut-toast
      msg="积分余额不足哦！快去赚钱吧"
      v-model:visible="show2"
      type="warn"
    />
    <nut-dialog
      teleport="#app"
      title="兑换"
      :onOk="handleSubmit"
      v-model:visible="visible"
    >
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100px;
        "
      >
        <nut-inputnumber
          button-size="30"
          v-model="goodsValue"
          min="1"
          :max="maxCount"
        />
      </div>
    </nut-dialog>
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
      goodsValue: 1,
      maxCount: 100,
      visible: false,
      categoryInfo: {},
      category: [{}],
      categoryChild: [{}],
      goodsList: [],
      totalIntegral: 0,
      price: 0,
      goodsName: "",
      show2: false,
      show3: false,
      openId: "",
      exchangeList: [],
    };
  },
  mounted() {
    this.getList();
    this.getExchangeList();
    this.totalIntegral = wx.getStorageSync("integral");
    this.openId = JSON.parse(wx.getStorageSync("userInfo")).OPENID;
  },
  components: {},
  methods: {
    getList() {
      let that = this;
      db.collection("goods")
        .get()
        .then((res) => {
          console.log(res);
          that.goodsList = res.data;
        });
    },
    getExchangeList() {
      let that = this;
      db.collection("exchange_list")
        .get()
        .then((res) => {
          console.log(res);
          that.exchangeList = res.data;
        });
    },
    handleClick(goodsStock, price, name) {
      this.visible = true;
      this.maxCount = +goodsStock;
      this.price = price;
      this.goodsName = name;
    },
    change() {},
    onChange() {},
    handleSubmit() {
      let amount = this.goodsValue * this.price;
      console.log(amount, +this.totalIntegral);
      if (amount > +this.totalIntegral) {
        this.show2 = true;
      } else {
        let that = this;
        db.collection("user_info")
          .where({ _openid: that.openId })
          .update({
            data: {
              integral: that.totalIntegral - amount,
            },
          })
          .then((res) => {
            that.show3 = true;
            that.updateExchange(amount);
          });
      }
    },
    updateExchange(amount) {
      let that = this;
      db.collection("exchange_list")

        .add({
          data: {
            goodsName: this.goodsName,
            value: this.goodsValue,
            amount: amount,
          },
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>
