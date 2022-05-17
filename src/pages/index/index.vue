<template>
  <view class="contaier">
    <div class="memorial" @click="handleLogo"></div>

    <div class="bottom-app">
      <div class="left" @click="handleRegret('1')">
        <div>又又的后悔本</div>
      </div>
      <div class="right" @click="handleRegret('2')">
        <div>又又的记账本</div>
      </div>
    </div>
    <div class="integral_box">
      <div>
        <div>我们在一起的</div>
        <div class="number">520 <span>天</span></div>
      </div>
      <div>
        <div>宝贝你已经有</div>
        <div class="number">
          52 <span>积分</span>
          <span style="float: right">
            <nut-button
              size="mini"
              color="#a7bae5"
              @click="handleExchange"
              type="info"
              >去兑换</nut-button
            >
          </span>
        </div>
      </div>
    </div>
    <div class="todobox">
      <nut-tabs v-model="tab1value" color="#a7bae5">
        <nut-tabpane title="未完成">
          <ul>
            <li v-for="item in list" :key="item._id">
              <div style="display: flex; align-items: center">
                <nut-button
                  color="#a7bae5"
                  size="mini"
                  @click="handleFinish(item._id)"
                  type="info"
                  >完成</nut-button
                >
                <span style="margin-left: 5px"> {{ item.taskName }} </span>

                <span style="padding-left: 10px">+{{ item.value }}分</span>
              </div>
              <div class="desc">{{ item.desc }}</div>
            </li>
          </ul>
        </nut-tabpane>
        <nut-tabpane title="已完成">
          <ul>
            <li v-for="item in truelist" :key="item._id">
              <div style="display: flex; align-items: center">
                {{ item.taskName }}

                <span style="padding-left: 10px">+{{ item.value }}分</span>
              </div>
              <div class="desc">{{ item.desc }}</div>
            </li>
          </ul>
        </nut-tabpane>
      </nut-tabs>
      <div style="margin-top: 10px; padding: 0px 10px; box-sizing: border-box">
        <nut-button block color="#a7bae5" type="primary" @click="handleAdd"
          >+</nut-button
        >
      </div>
    </div>

    <nut-toast
      msg="好啦！知道你在想我了！"
      v-model:visible="show"
      type="success"
    />
    <nut-toast msg="太棒了宝贝！" v-model:visible="show2" type="success" />
  </view>
</template>

<script>
import "./index.scss";

import Taro from "@tarojs/taro";
const db = wx.cloud.database();
export default {
  name: "Index",
  components: {},
  mounted() {
    Taro.cloud.init();
    this.getList();
    this.getFinishList();
  },
  data() {
    return {
      checkboxgroup: [],
      checkboxgroup1: [],
      show: false,
      tab1value: "0",
      list: [],
      truelist: [],
      show2: false,
    };
  },
  methods: {
    getList() {
      const _ = db.command;
      let that = this;
      db.collection("task_list")
        .where({
          // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
          isFinish: _.eq(false),
        })
        .get({
          success: function (res) {
            that.list = res.data;
          },
        });
    },
    getFinishList() {
      const _ = db.command;
      let that = this;
      db.collection("task_list")
        .where({
          // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
          isFinish: _.eq(true),
        })
        .get({
          success: function (res) {
            that.truelist = res.data;
          },
        });
    },
    handleRegret(type) {
      if (type === "1") {
        Taro.navigateTo({
          url: "/pages/regret/index",
        });
      } else {
        Taro.navigateTo({
          url: "/pages/book_keep/index",
        });
      }
    },
    handleLogo() {
      wx.vibrateShort({
        type: "heavy",
        success: (res) => {
          this.show = true;
        },
      });
    },
    handleAdd() {
      Taro.navigateTo({
        url: "/pages/task_add/index",
      });
    },
    handleExchange() {
      Taro.navigateTo({
        url: "/pages/commodity/index",
      });
    },
    handleFinish(id) {
      let that = this;
      db.collection("task_list")
        .doc(id)
        .update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            isFinish: true,
          },
          success: function (res) {
            that.show2 = true;
            that.getList();
            console.log(res.data);
          },
        });
    },
  },
};
</script>
