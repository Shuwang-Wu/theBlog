/*eslint-disable*/
var client = function() {
  // 呈现引擎
  var engine = {
    ie: 0,
    gecko: 0,
    webkit: 0,
    khtml: 0,
    opera: 0,
    // 完整的版本号
    ver: null
  }

  // 浏览器
  var browser = {
    // 主要浏览器
    ie: 0,
    firefox: 0,
    safari: 0,
    konq: 0,
    opera: 0,
    chrome: 0,
    // 具体的版本号
    ver: null
  }

  // 平台、设备和操作系统
  var system = {
    win: false,
    mac: false,
    x11: false,
    // 移动设备
    iphone: false,
    ipod: false,
    ios: false,
    android: false,
    nokiaN: false,
    winMobile: false,
    // 游戏系统
    wii: false,
    ps: false
  }

  // 检测呈现引擎和浏览器
  var ua = navigator.userAgent
  if (window.opera) {
    engine.ver = browser.ver = window.opera.version()
    // engine.opera = browser.
  }
}
// 详情参考红宝书 P262
