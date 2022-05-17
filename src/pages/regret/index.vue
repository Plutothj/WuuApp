<template>
  <div class="contaier">
    <div class="title">
      <div class="left"></div>
      <div class="right">人生不如意十有八九，希望你的后悔事越来越少！</div>
    </div>
    <ul>
      <li v-for="item in list" :key="item.time">
        <div>
          <div>
            <nut-icon name="dongdong"></nut-icon>
            {{ item.desc }}
          </div>
          <div class="date">
            {{ getTime(item.time) }}
          </div>
        </div>
        <div class="del">
          <div>
            <nut-icon @click="handleDel(item._id)" name="del2"></nut-icon>
          </div>
        </div>
      </li>
    </ul>
    <div style="width: 90%; margin-top: 30px">
      <nut-button color="#a7bae5" @click="handleAdd" block type="primary"
        >添加新的后悔事</nut-button
      >
    </div>
    <nut-dialog
      title="删除"
      content="确定要删除吗"
      v-model:visible="visible"
      @cancel="onCancel"
      @ok="onOk"
    />
    <nut-toast
      msg="终于等到你，太好了堡！又少了一件后悔事！"
      v-model:visible="show"
      type="success"
    />
  </div>
</template>

<script>
import "./index.scss";
import Taro from "@tarojs/taro";
const db = wx.cloud.database();
export default {
  name: "Regret",
  data() {
    return {
      list: [],
      visible: false,
      id: "",
      show: false,
    };
  },
  mounted() {
    this.getList();
  },

  components: {},
  methods: {
    getList() {
      let that = this;
      db.collection("regret_list")
        .get()
        .then((res) => {
          console.log(res);
          if (res.data) {
            that.list = res.data;
          }
        });
    },
    handleAdd() {
      Taro.navigateTo({
        url: "/pages/regret_add/index",
      });
    },
    onCancel() {
      this.visible = false;
    },
    onOk() {
      let that = this;
      db.collection("regret_list")
        .doc(this.id)
        .remove()
        .then((res) => {
          console.log(res);
          if (res.stats.removed == "1") {
            that.show = true;
            that.getList();
          }
        });
    },
    handleDel(id) {
      this.visible = true;
      this.id = id;
    },
    getTime(date) {
      return date.toLocaleString();
    },
  },
};
</script>
