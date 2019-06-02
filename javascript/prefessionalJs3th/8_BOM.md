# BOM

理解 window 对象--BOM 的核心
控制窗口、框架和弹出窗口
利用 location 对象中的页面信息
使用 navigatior 对象了解浏览器

## window 对象

BOM 的核心对象是 window，它表示浏览器的一个实例
在浏览器中 window 既是 js 访问浏览器窗口的一个接口，又是 ECMAScript 规定的 Global 对象

### 全局作用域

全局变量不能通过 delete 操作符删除，而直接在 window 对象上的定义的属性可以

### 窗口关系和框架

略

超时调用的代码都是在全局作用域中执行的, 因此函数中 this 的值在非严格模式下指向 window 对象, 在严格模式下是 undefined

## location 对象

### 查询字符串参数

###位置操作
location.assign: 可以立即打开新 URL 并在浏览器的历史记录中生成一条记录
location.href: 该方法也会调用 location.assign

每次修改 location 的属性, 页面都会重新加载

属性有: hash, pathname, port, search, hostname

location.replace(): 跳转到一个新的页面,但是不会在历史记录中生成新的记录

location.reload(): 重新加载页面, 传递参数为 true 的话页面会从服务端重新获取

## navigator 对象

### 检测插件

检测浏览器中是否安装了插件是一个常见的检测例程，对于非 IE 可以使用 plugins 来进行检测
每个 plugin 都包含以下参数:
name: 插件的名字
description: 插件的描述
filename: 插件的文件名
length: 插件所处理的 MIME 类型数量

```js
function hasPlugin(name) {
  name = name.toLowerCase()
  for (var i = 0; i < navigator.plugins.length; i++) {
    if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
      return true
    }
  }
}
```

因为不同插件之间检测的差别过大, 所以典型的做法是针对每个插件分别创建检测函数

```js
// 检测Flash
function hasFlash() {
  var result = hasPlugin('Flash')
  if (!result) {
    result = hasIEPlugin('ShockwaveFlash.ShockwaveFlash')
  }
  return result
}
// 检测QuickTime
function hasQuickTime() {
  var result = hasPlugin('QuickTime')
  if (!result) {
    result = hasIEPlugin('QuickTime.QuickTime')
  }
  return result
}
```

### 注册处理程序

FireFox2 为 navigator 对象新增了 registerContentHandler()和 registerProtocolHandler()方法, 这两个方法可以让一个站点指明它可以处理特定类型的信息

- registerContentHandler
  接收三个参数:
  1. 要处理的 MIME 类型
  2. 可以处理改 MIME 类型的页面 URL
  3. 应用程序的名称

## screen 对象

1. availHeight: 屏幕的像素高度减去系统部件高度之后的值(只读)
2. availLeft: 未被系统部件占用的最左侧的像素值(只读)
3. availTop: 未被系统部件占用的最上方的像素值(只读)
4. availWidth: 屏幕的像素宽度减去系统部件宽度之后的值(只读)
5. bufferDepth: 读写用于呈现外位图的位数
6. colorDepth: 用于表现颜色的位数；多数系统都是 32(只读)
7. deviceXDPI: 屏幕实现水平 DPI(只读)
8. deviceYDPI: 屏幕实现垂直 DPI(只读)
9. fontSmoothingEnabled: 表示是否启用了字体平滑(只读)
10. height: 屏幕的像素高度
11. left: 当前屏幕距左边的像素距离
12. logicalXDPI: 屏幕逻辑的水平 DPI(只读)
13. logicalYDPI: 屏幕逻辑的垂直 DPI(只读)
14. top: 当前屏幕距上边的像素距离
15. updateInterval: 读写以毫秒表示的屏幕刷新时间间隔
16. width: 屏幕的像素宽度

## history 对象

history.go()
history.back()
history.forward()
