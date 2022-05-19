<template>
  <div class="contaier">
    <div style="width: 90%; margin-top: 20px" class="box">
      <nut-input
        v-model="title"
        label="任务名称"
        placeholder=" "
        type="text"
        maxLength="50"
      />
      <nut-input
        v-model="value"
        placeholder=" "
        label="换取积分"
        type="number"
      />
      <nut-input
        v-model="textarea"
        label="备注"
        type="textarea"
        placeholder=" "
        show-word-limit
        rows="2"
      />
    </div>
    <div style="width: 90%; margin-top: 30px">
      <nut-button color="#a7bae5" @click="handleAdd" block type="primary"
        >添加</nut-button
      >
    </div>
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
      textarea: "",
      show: false,
      title: "",
      value: 0,
    };
  },
  mounted() {},
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
    handleAdd() {
      let that = this;
      db.collection("task_list")
        .add({
          // data 字段表示需新增的 JSON 数据
          data: {
            taskName: that.title,
            value: that.value,
            addTime: that.getNowDate(),
            desc: that.textarea,
            isFinish: false,
          },
        })
        .then((res) => {
          if (res._id) {
            that.show = true;
            Taro.navigateTo({
              url: "/pages/index/index",
            });
          }
        });
    },
  },
};
</script>
