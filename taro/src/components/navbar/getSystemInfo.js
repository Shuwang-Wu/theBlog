/**
 * @Description  : 获取系统信息
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-28 16:45:06
 * @LastEditTime : 2020-07-30 10:47:22
 * @FilePath     : \bid\src\components\navbar\getSystemInfo.js
 */

import { isFunction } from "@/utils/tools"
import Taro from "@tarojs/taro"

export const getSystemInfo = function () {
  // 获取Taro上的globalSystemInfo属性
  let globalSystemInfo = Taro.globalSystemInfo
  // 如果存在说明已经获取过, 直接返回该属性值
  if (globalSystemInfo && !globalSystemInfo.ios) {
    return globalSystemInfo
  } else {
    // h5环境下忽略navbar
    if (!isFunction(Taro.getSystemInfoSync)) {
      return null
    }
    let systemInfo = Taro.getSystemInfoSync() || {
      model: "",
      system: "",
    }
    if (!systemInfo.system) {
      return systemInfo
    }
    let ios = systemInfo.system.toLowerCase().search("ios") !== -1
    let rect
    try {
      rect = Taro.getMenuButtonBoundingClientRect
        ? Taro.getMenuButtonBoundingClientRect()
        : null
      if (rect === null) {
        throw "getMenuButtonBoundingClientRect error"
      }
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw "getMenuButtonBoundingClientRect error"
      }
    } catch (error) {
      // 胶囊按钮上下间距 使导航内容居中
      let gap = ""
      // 胶囊的宽度
      let width = 96
      // 当前手机系统
      let platform = systemInfo.platform
      switch (platform) {
        case "android":
          gap = 8
          width = 96
          break
        case "devtools":
          gap = ios ? 5.5 : 7.5
          break
        default:
          gap = 4
          width = 88
      }
      if (!systemInfo.statusBarHeight) {
        // 开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight =
          systemInfo.screenHeight - systemInfo.windowHeight - 20
      }
      rect = {
        // 获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width,
      }
    }
    let navbarHeight = 0
    if (!systemInfo.statusBarHeight) {
      // 开启wifi和打电话下
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
      navbarHeight = (function () {
        let gap = rect.top - systemInfo.screenHeight
        return 2 * gap + rect.height
      })()
      systemInfo.screenHeight = 0
      systemInfo.navBarExtendHeight = 0
    } else {
      navbarHeight = (function () {
        let gap = rect.top - systemInfo.statusBarHeight
        return systemInfo.statusBarHeight + 2 * gap + rect.height
      })()
      if (ios) {
        //下方扩展4像素高度 防止下方边距太小
        systemInfo.navBarExtendHeight = 4
      } else {
        systemInfo.navBarExtendHeight = 0
      }
    }
    // 导航栏高度不包括statusBarHeight
    systemInfo.navbarHeight = navbarHeight
    // 右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.capsulePosition = rect
    // 是否ios
    systemInfo.ios = ios
    // 将信息保存到全局变量中,后边再用就不用重新异步获取了
    Taro.globalSystemInfo = systemInfo
    return systemInfo
  }
}


