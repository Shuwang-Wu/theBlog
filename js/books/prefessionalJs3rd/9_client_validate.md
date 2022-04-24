# 客户端检测

1. 使用能力检测
2. 用户代理检测的历史
3. 选择检测方式

## 能力检测

要理解能力检测就要理解两个概念:

1. 先检测达成目的的常用特性
2. 必须测试实际要用到的特性

### 更可靠的能力检测

用 typeof 来进行类型检测

### 能力检测不是浏览器检测

```js
// 确定浏览器是否支持netscape风格的插件
var hasNSPlugins = !!(navigator.plugins && navigator.plugins.length)
// 确定浏览器是否具有DOM1级规定的能力
var hasDOM1 = !!(
  document.getElementById &&
  document.createElement &&
  document.getElementsByTagName
)
```

## 怪癖检测

与能力检测不同的是能力检测是检测浏览器什么能力的不同, 怪癖检测是想要知道浏览器存在什么缺陷

## 用户代理检测

用户代理检测通过检测用户代理字符串来确定实际使用的浏览器；
每一次 HTTP 请求过程中，用户代理字符串时作为响应头部发送的，而且该字符串可以通过 js 的 navigator.userAgent 属性访问。
在服务端, 通过检测用户代理字符串来确定用户使用的浏览器是一种常用而且广为接受的做法

[以下是完整的用户代理字符串检测脚本, 包括检测呈现引擎、平台、Windows 操作系统、移动设备和游戏系统](./get_client.js)
