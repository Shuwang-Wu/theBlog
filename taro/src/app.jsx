/**
 * @Description  : 顶部导航栏组件
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-28 12:25:58
 * @LastEditTime : 2020-07-28 15:17:24
 * @FilePath     : \bid\src\app.jsx
 */
import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { View, Button, Text } from "@tarojs/components";
import { Provider } from "react-redux";
import configStore from "./store";
import { Navbar } from "@/components";
import "./app.less";

const store = configStore();

class App extends Component {
  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      console.log('weapp')
    } else if (process.env.TARO_ENV === 'h5') {
      console.log('h5')
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Provider store={store}>
      <Navbar title="首页" />
      {this.props.children}
    </Provider>;
  }
}

export default App;
