<template>
  <view class="contaier">
    <div class="memorial" @click="getUserInfo"></div>

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
        <div class="number">{{ getTime() }} <span>天</span></div>
      </div>
      <div>
        <div>宝贝你已经有</div>
        <div class="number">
          {{ totalIntegral }} <span>积分</span>
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
                  @click="handleFinish(item._id, item.value)"
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
    <nut-toast
      :msg="userInfo.nickName + '你终于来了！'"
      v-model:visible="show3"
    />
    <nut-toast msg="先点击下玉桂狗吧" v-model:visible="show4" />
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
    this.getList();
    this.getFinishList();
    if (wx.getStorageSync("user")) {
      this.getIntegral();
    } else {
      this.show4 = true;
    }

    let that = this;
    Taro.cloud
      .callFunction({
        name: "login",
        data: {},
      })
      .then((res) => {
        console.log(res);
        wx.setStorageSync("userInfo", JSON.stringify(res.result));
        this.context = res.result;
      })
      .catch((error) => {
        console.log(error);
      });
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
      show3: false,
      show4: false,
      integral: 0,
      context: "",
      userInfo: {},
      hasLogin: false,
      totalIntegral: 0,
    };
  },
  methods: {
    getUserInfo() {
      let that = this;
      if (wx.getStorageSync("user")) {
        wx.vibrateShort({
          type: "heavy",
          success: (res) => {
            this.show = true;
          },
        });
      } else {
        Taro.getUserProfile({
          lang: "zh_CN",
          desc: "获取你的昵称、头像",
          success: (res) => {
            console.log(res);
            that.userInfo = res.userInfo;
            wx.setStorageSync("user", JSON.stringify(res.userInfo));
            that.show3 = true;
            that.createUserInfo();
          },
        });
      }
    },
    createUserInfo() {
      let that = this;
      db.collection("user_info").add({
        data: {
          integral: that.totalIntegral,
          name: that.userInfo.nickName,
        },
        success: function (res) {
          that.getIntegral();
        },
      });
    },
    getTime() {
      let futimg = "2021,8,2";
      let nowtime = new Date().getTime(); // 现在时间转换为时间戳
      let futruetime = new Date(futimg).getTime(); // 未来时间转换为时间戳
      let msec = nowtime - futruetime; // 毫秒 未来时间-现在时间
      let time = msec / 1000; // 毫秒/1000
      let day = parseInt(time / 86400); // 天  24*60*60*1000

      return day;
    },
    getIntegral() {
      let that = this;

      db.collection("user_info")
        .where({ _openid: that.context.OPENID })
        .get({
          success: function (res) {
            that.totalIntegral = res.data[0].integral;

            wx.setStorageSync("integral", that.totalIntegral);
          },
        });
    },
    getList() {
      const _ = db.command;
      let that = this;
      db.collection("task_list")
        .orderBy("addtime", "desc")
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

            // let result = res.data.reduce((a, b) => {
            //   a = a + +b.value;
            //   return a;
            // }, 0);
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
    updateIntegral(id, num) {
      let that = this;
      db.collection("user_info")
        .where({ _openid: that.context.OPENID })
        .update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            integral: that.totalIntegral + +num,
          },
        })
        .then((res) => {
          that.getList();
          that.getFinishList();
          that.getIntegral();
        });
    },
    handleFinish(id, num) {
      let that = this;
      db.collection("task_list")
        .doc(id)
        .update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            isFinish: true,
          },
        })
        .then((res) => {
          that.show2 = true;

          that.updateIntegral(id, num);
        });
    },
  },
};
</script>
