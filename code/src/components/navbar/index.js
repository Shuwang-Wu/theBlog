/**
 * @Description  : 顶部导航栏组件
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-28 12:25:58
 * @LastEditTime : 2020-07-30 12:00:08
 * @FilePath     : \bid\src\components\navbar\index.js
 */

import React, { Component } from "react"
import { View, Image, Text } from "@tarojs/components"
import { getSystemInfo } from "./getSystemInfo"
import "./index.less"
import { icons } from '@/utils/images.js'

let { loading, menuBack } = icons
let globalSystemInfo = getSystemInfo();
export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // configStyle: this.setStyle(globalSystemInfo)
    }
  }
  static options = {
    multipleSlots: true,
    addGlobalClass: true
  }
  componentDidMount() {
    console.log(globalSystemInfo, 'globalSystemInfo')
    console.log(loading, 'loading')
  }
  render() {
    let { background, title, back, children } = this.props
    const style = {
      paddingTop: globalSystemInfo.statusBarHeight + "px",
      backgroundColor: background || 'transparent'
    }
    return (
      <View className="navbar-wrap" style={style}>
        {
          children ? children :
            <View className="navbar">
              <View className="navbar-left">
                {back ? <Image className="navbar-left__back" src={menuBack} /> : null}
                <Text className="navbar-left__text">{title}</Text>
              </View>
              <View className="navbar-center">

              </View>
              <View className="navbar-right"></View>
            </View>
        }
      </View>
    )
  }
}
