<!--
 * @Author: Shuwang_wu
 * @Date: 2022-04-25 17:01:40
 * @LastEditTime: 2022-04-25 17:25:54
 * @LastEditors: Shuwang_wu
 * @FilePath: \git\theBlog\js\framework\fast-click.md
 * @Description: fastClick 原理解析
-->

# fastClick

## 为什么使用FastClick ?

在移动端H5开发过程中，关于点触可能会遇到如下两个问题：
1. 手动点击与真正触发click事件会存在300ms的延迟
2. 点击穿透问题（点击行为会穿透元素触发非父子关系元素的事件）

延迟的存在时因为浏览器想知道你是否在进行双击操作；而点击穿透是因为300ms延迟触发时的副作用。而使用fastclick能很好的解决这个问题，增加使用者的体验。

## 可以不使用的场景
不必使用的浏览器环境如下：
```bush
Android + Chrome >32
Android + Chrome + meta="user-scalable=no"
部分黑莓手机环境（可略过）
部分WindowsPhone环境（可略过）
```
这部分的判断在下面的方法中有体现，如果当前环境支持快速点击，则FastClick会自动跳过初始化。
FastClick.notNeeded = function(layer) { ... }

## 原理过程
如果完整的描述FastClick过程需要考虑多种场景的兼容，这里就描述一个按钮点击过程的处理，下面是用来描述的代码：
```js
  // 业务代码
  var $test = document.getElementById('test')
  $test.addEventListener('click', function () {
    console.log('1 click')
  })

  // FastClick简单实现
  var targetElement = null
  document.body.addEventListener('touchstart', function () {
    // 记录点击的元素
    targetElement = event.target
  })
  document.body.addEventListener('touchend', function (event) {
    // 阻止默认事件（屏蔽之后的click事件）
    event.preventDefault()
    var touch = event.changedTouches[0]
    // 合成click事件，并添加可跟踪属性forwardedTouchEvent
    var clickEvent = document.createEvent('MouseEvents')
    clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null)
    clickEvent.forwardedTouchEvent = true // 自定义的
    targetElement.dispatchEvent(clickEvent)
  })
```

## 过程说明：
1. 业务正常使用click绑定事件
2. 在document.body绑定touchstart和touchend
    touchstart 用于记录当前点击的元素targetElement；
    touchend 阻止默认事件（屏蔽之后的click事件）
    合成click事件，并添加可跟踪属性forwardedTouchEvent
    在targetElement上触发click事件
    targetElement上绑定的事件立即执行，完成FastClick
3. 执行业务自己的click事件

## 总结：
    以上就完成了模拟FastClick，是不是很简单。事件的执行过程需要了解：touch事件先于mouse事件先于click执行，因此可以在document.body上绑定事件用于监听点触行为，根据需要模拟click触发真正需要响应的元素。