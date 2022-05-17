<template>
  <div class="contaier">
    <div style="width: 90%; border-radius: 10px">
      <nut-input
        v-model="textarea"
        label=""
        type="textarea"
        show-word-limit
        rows="2"
        maxLength="50"
        placeholder="请输入后悔的事"
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
  name: "regret-add",
  data() {
    return {
      textarea: "",
      show: false,
    };
  },
  mounted() {},
  components: {},
  methods: {
    handleAdd() {
      let that = this;
      db.collection("regret_list")
        .add({
          // data 字段表示需新增的 JSON 数据
          data: {
            desc: that.textarea,
            time: new Date(),
          },
        })
        .then((res) => {
          if (res._id) {
            that.show = true;
            Taro.navigateTo({
              url: "/pages/regret/index",
            });
          }
        });
    },
  },
};
</script>
