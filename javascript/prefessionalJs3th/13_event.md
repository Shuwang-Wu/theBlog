# 事件

理解事件流
使用事件处理程序
不同的事件类型

## 事件流

事件流描述的是从页面中接收事件的顺序。
IE 的事件流是事件冒泡流
NetScape 提出的是事件捕获流

### 事件冒泡流

从焦点元素一直向上到 document, iE9,chrome,firefox 一直冒泡到 window 对象

### 事件捕获

从不太具体的目标向下到具体的元素，即从 window => target

### DOM 事件流

"DOM2 事件"规定的事件流包括三个阶段: 事件捕获阶段、处于目标阶段和事件冒泡阶段；

1. 在事件捕获阶段实际的目标不会收到事件；
2. 处于目标阶段事件在目标元素上发生；
3. 冒泡阶段发生，事件又传播回文档

- 即使 DOM2 明确要求捕获阶段不会触发事件，但是 IE，chrome 等都会在捕获阶段触发，结果就是有两个机会在目标对象上操作事件

## 事件处理程序

事件就是用户或者浏览器自身执行的某种操作；
而响应某个事件的函数叫做事件处理程序；

1. DOM0 DOM2
   addEventListener removeEventListener
2. IE
   attachEvent detachEvent

两者不同之处在于事件处理程序的作用域不同，1 的作用域为所属元素的作用域，2 作用域为 window

## 事件对象

### dom 中的事件对象

- event.currentTarget 指注册事件的元素
- event.target 触发事件的目标元素
- this 指注册事件的元素
- eventPhase 可以用来确定当前事件正位于事件流的哪个阶段
  如果是捕获阶段调用事件处理程序，那么值为 1
  如果在目标对象上触发则值为 2
  如果在冒泡阶段则值为 3

### IE 中的事件对象

cancelBubble boolean 设置为 true 就可以取消事件冒泡
returnValue 默认值为 true 设置为 false 就可以取消事件的默认行为
scrElement element 事件的目标
type string 被触发的事件类型

## 4.事件类型

### 4.1 UI 事件

load, unload, abort, error, select, scroll

- 触摸设备
