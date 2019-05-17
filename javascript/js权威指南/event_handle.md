# JavaScript 事件处理

客户端 JavaScript 程序采用了异步事件驱动编程模型

1. 事件类型

是一个用来说明发生了什么类型事件的字符串

2. 事件目标

是发生的时间或与之相光的对象

3. 事件处理程序或者事件监听程序

是指处理或响应事件的的函数 ##事件对象
是与特定事件相关且包含有关改时间详细信息的对象

4. 事件传播

是浏览器决定哪个对象触发其事件处理程序的过程

- 冒泡
- 捕获

5. 一些与事件相关的默认操纵

a 链接上点击时默认跳转到新的链接地址

## 事件类型

- 新事件的主要来源
  - 3 级 dom 事件
  - html5 规范及相关衍生规范的大量新 API 定义了新事件
  - 基于触摸和支持 JavaScript 的移动设备的出现，需要定义新的触摸和手势事件类型

1. 依赖于设备的输入事件
2. 独立于设备的输入事件
3. 用户界面事件
4. 状态变化事件
5. 特定 API 事件
6. 计时器和错误处理程序

### 表单事件

focus,blur 不会冒泡

### window 事件

load: 当文档和外部资源全部加载完成之后并显示给用户时就会触发它
unload: 离开当前页面时触发，可以保存用户状态但是不能终止跳转
resize scroll

### 鼠标事件

会冒泡到顶层

### 键盘事件

### DOM 事件

常用的 DOMContentLoaded
focusin focusout 取代了冒泡的 focus blur
mouseenter mouseleave 取代 mouseover mouseout

### html5 事件

指定一串 JavaScript 代码作为 HTML 事件处理程序属性的值时，浏览器会把代码转换成类似如下的函数中

```js
function (event) {
  with(document) {
    with(this.form || {}) {
      with(this) {
        /* code  */
      }
    }
  }
}
```

- addEventListener(事件名: string, 事件处理函数: function, 是否捕获: boolean)

- 事件处理程序的返回值是有意义的: 通常返回 false 是告诉浏览器不要执行这个相关的默认操作

### 事件的调用顺序

1. 通过设置对象属性或 HTML 属性注册的处理程序一直优先调用
2. addEventListener 注册的程序按照他们注册的顺序进行调用
3. 使用 attachEvent 注册的程序可能按照注册的顺序进行调用

### 鼠标滚轮事件
