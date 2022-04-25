/**
 * @Description  : 倒计时组件
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-30 11:51:28
 * @LastEditTime : 2020-07-30 12:19:38
 * @FilePath     : \bid\src\components\count-down\index.js
 */
import React, { Component } from "react"
import { View, Text } from "@tarojs/components"
import "./index.less"

export default class CountDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hour: 0,
      minute: 0,
      second: 0
    }
  }
  componentDidMount() {

  }
  start() { }
  end() {
    this.props.onEnd()
  }
  render() {
    return (
      <View className="countDown-wrap">
        {this.props.children ?
          <View className="">
            <Text className="hour">{hour}</Text>:
            <Text className="minute">{minute}</Text>:
            <Text className="second">{second}</Text>
          </View> :
          this.props.children
        }
      </View>
    )
  }
}
