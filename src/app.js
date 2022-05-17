import Taro from "@tarojs/taro";

import { createApp } from "vue";
import {
  Button,
  Toast,
  Swiper,
  SwiperItem,
  Tabbar,
  TabbarItem,
  Icon,
  Cell,
  Countup,
  Checkbox,
  CheckboxGroup,
  Input,
  Dialog,
  Popup,
  OverLay,
  calendar,
  Picker,
  Radio,
  RadioGroup,
  Form,
  FormItem,
  CellGroup,
  Tabs,
  TabPane,
  Category,
  CategoryPane,
  Card,
  Tag,
  Price,
} from "@nutui/nutui-taro";

import "./app.scss";
import "./assets/font/iconfont.css";
const App = createApp({
  onMounted() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
    }
  },
  onShow(options) {
    wx.cloud.init();
  },

  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});
App.use(Dialog)
  .use(Popup)
  .use(calendar)
  .use(OverLay)
  .use(Button)
  .use(Input)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Toast)
  .use(Swiper)
  .use(SwiperItem)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Icon)
  .use(Cell)
  .use(Countup)
  .use(Picker)
  .use(Form)
  .use(FormItem)
  .use(Radio)
  .use(RadioGroup)
  .use(Tabs)
  .use(TabPane)
  .use(Category)
  .use(CategoryPane)
  .use(Card)
  .use(Tag)
  .use(Price)
  .use(CellGroup);
export default App;
