<template>
  <div class="contaier">
    <div class="test-calendar-wrapper">
      <nut-calendar
        :poppable="false"
        :is-auto-back-fill="true"
        :show-title="false"
        :show-sub-title="false"
        :show-today="true"
        :start-date="`2022-05-01`"
        :end-date="null"
        @choose="setChooseValue"
      >
      </nut-calendar>
    </div>
    <div class="list_box">
      <ul>
        <li v-for="item in list" :key="item._id">
          <div>
            <nut-icon
              font-class-name="iconfont"
              class-prefix="icon"
              :name="fifterIcon(item.type)"
            />
            <span style="padding-left: 10px">{{ fifterName(item.type) }}</span>
          </div>
          <div class="desc">支出￥{{ item.money }}元</div>
        </li>
      </ul>
      <div class="sum">合计支出：{{ totalMoney }}元</div>
    </div>
    <div style="width: 90%; margin-top: 30px">
      <nut-button color="#a7bae5" @click="handleAdd" block type="primary"
        >添加</nut-button
      >
    </div>
    <nut-dialog teleport="#app" v-model:visible="visible" :onOk="handleOk">
      <div>
        <nut-radiogroup v-model="radioVal" direction="horizontal">
          <nut-radio shape="button" label="1">餐饮</nut-radio>
          <nut-radio shape="button" label="2">衣服</nut-radio>
          <nut-radio shape="button" label="3">购物</nut-radio>
          <nut-radio shape="button" label="4">人际</nut-radio>
          <nut-radio shape="button" label="5">水果</nut-radio>
          <nut-radio shape="button" label="6">学习</nut-radio>
          <nut-radio shape="button" label="7">化妆品</nut-radio>
          <nut-radio shape="button" label="8">其他</nut-radio>
        </nut-radiogroup>

        <nut-input
          style="margin-top: 10px"
          label="金额"
          label-width="40"
          placeholder="请输入金额"
          type="number"
          v-model="money"
        />
        <nut-input
          style="margin-top: 10px"
          label="备注"
          placeholder="请输入备注"
          type="textarea"
          show-word-limit
          label-width="40"
          rows="2"
          maxLength="50"
          v-model="desc"
        />
      </div>
    </nut-dialog>
    <nut-toast msg="新增成功" v-model:visible="show" type="success" />
  </div>
</template>

<script>
import "./index.scss";
import Taro from "@tarojs/taro";
const db = wx.cloud.database();
export default {
  name: "book-keep",
  data() {
    return {
      list: [],
      visible: false,
      id: "",
      show: false,
      radioVal: "",
      money: "",
      desc: "",
      date: this.getNowDate(),
      totalMoney: 0,
    };
  },
  mounted() {
    this.getList();
  },

  components: {},
  methods: {
    getNowDate() {
      let myDate = new Date();
      let year = myDate.getFullYear(); //获取当前年
      let mon = myDate.getMonth() + 1; //获取当前月
      if (mon < 10) {
        mon = "0" + mon;
      }
      let date = myDate.getDate(); //获取当前日
      if (date < 10) {
        date = "0" + date;
      }

      let now = year + "-" + mon + "-" + date;
      return now;
    },
    getList() {
      const _ = db.command;
      let that = this;
      db.collection("bookkeep_list")
        .where({
          // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
          date: _.eq(that.date),
        })
        .get({
          success: function (res) {
            console.log(res.data);
            that.totalMoney = 0;
            that.list = res.data;
            that.list.forEach((item) => {
              that.totalMoney += Number(item.money);
            });
          },
        });
    },
    setChooseValue(data) {
      this.date = data["3"];
      this.getList();
      console.log(data["3"], this.list);
    },
    handleAdd() {
      this.visible = true;
    },
    handleOk() {
      let that = this;
      db.collection("bookkeep_list")
        .add({
          // data 字段表示需新增的 JSON 数据
          data: {
            money: that.money,
            desc: that.desc,
            type: that.radioVal,
            date: that.date,
          },
        })
        .then((res) => {
          console.log(res);
          if (res._id) {
            that.show = true;
            this.getList();
          }
        });
    },
    fifterName(name) {
      switch (name) {
        case "1":
          return "餐饮";
          break;
        case "2":
          return "衣服";
          break;
        case "3":
          return "购物";
          break;
        case "4":
          return "人际";
          break;
        case "5":
          return "水果";
          break;
        case "6":
          return "学习";
          break;
        case "7":
          return "化妆品";
          break;
        case "8":
          return "其他";
          break;

        default:
          break;
      }
    },
    fifterIcon(type) {
      switch (type) {
        case "1":
          return "canyin";
          break;
        case "2":
          return "gongjiao";
          break;
        case "3":
          return "gouwuchekong";
          break;
        case "4":
          return "feiji";
          break;
        case "5":
          return "shuiguo";
          break;
        case "6":
          return "xuexi";
          break;
        case "7":
          return "fumu";
          break;
        case "8":
          return "canyin";
          break;

        default:
          break;
      }
    },
  },
};
</script>
