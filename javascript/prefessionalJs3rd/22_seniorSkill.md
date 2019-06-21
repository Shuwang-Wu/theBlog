# 高级技巧

使用高级函数
防篡改对象
Yielding Timers

## 高级函数

1. 安全的类型检测
2. 作用域安全的构造函数
3. 惰性载入
   - 在函数被调用时再处理函数，在第一次调用的过程中，该函数会被覆盖为另外一个按合适方式执行的函数，这样任何对原函数的调用都不用再经过执行的分支了
   - 在声明函数时就指定适当的函数
4. 函数绑定
   ```js
   function bind(fn, context) {
     return function() {
       return fn.apply(context, arguments)
     }
   }
   ```
5. 函数柯里化
   用于创建一个或多个参数的函数，基本方法和函数绑定是一样的: 使用一个闭包返回一个函数，区别在于当函数被调用时返回的函数需要设置一些传入的参数

```js
function curry(fn) {
  var args = Array.prototype.slice.call(arguments, 1)
  return function() {
    var innerArgs = Array.prototype.slice.call(arguments)
    var finalArgs = args.concat(innerArgs)
    return fn.apply(null, finalArgs)
  }
}
```

## 防篡改对象

1.  不可扩展对象
    Object.preventExtension(obj)可以让传入的对象添加或改变属性无效
    object.isExtensible()方法可以确定对象是否可以扩展
2.  密封的对象
    Object.seal(obj)调用这个方法以后传入对象已有成员的\[\[configurable\]\]将被设置为 false
    Objectl.isSealed()
3.  冻结的对象
    最严格的的防篡改
    Object.freeze() 不允许扩展又是密封的
    Object.isFrozen() 检测冻结对象

## 高级定时器

关于定时器要记住最重要的事情是，指定时间间隔表示何时将定时器的代码添加到队列，而不是何时实际执行代码

1. 重复的定时器
2. Yielding Process
   运行在浏览器中 js 都被分配了一个确定是数量的资源，以防止恶意的 web 程序员把用户计算机搞挂了
   限制有:
   - 长时间运行脚本的制约，定时器可以绕开此限制
3. 函数节流
   某些代码不可以在没有间断的情况下连续重复执行, 每次调用重新设置一个定时器， 如果前一个定时器已经使用过则继续执行，否则清除之前的定时器；
   目的只是在执行函数的请求停止了一段时间后执行相的代码
   ```js
   var processor = {
     timeroutid: null,
     performProcessing: function() {},
     process: function(interval) {
       clearTimeout(timeroutid)
       var that = this
       this.tiemroutid = setTimeout(function() {
         performProcessing()
       }, interval)
     }
   }
   <!-- 使用throttle来进行简化 -->
   function throttle(method, context, interval) {
      clearTimeout(method.timeroutid)
      method.timeroutid = setTimeout(function() {
        method.call(context)
      }, interval)
   }
   ```

## 自定义事件

事件是一种观察者模式，是一种创建松散耦合代码的技术
观察者模式有两类对象组成: 主体和观察者，主体负责发布事件，同时观察者通过订阅这些事件来观察该主体

```js
function EventTarget() {
  // 单独的属性，用于储存事件处理程序
  this.handlers = {}
}
EventTarget.prototype = {
  constructor: EventTarget,
  /**
  * @desc 用于注册给定类型的事件处理程序
  * @param {type} 事件类型
  * @param {handler} 处理函数
  */
  addHandler: function(type, handler) {
    // 检查是否存在该事件类型的一个数组, 没有则创建
    if (typeof this.handlers[type] == 'undefined') {
      this.handlers[type] = []
    }
    // 添加到该数组中
    this.handlers[type].push(handler)
  },
  /**
  * @desc 触发一个事件
  * @param {event} 事件类型
  */
  fire: function(event) {
    if(!event){
      event.target = this
    }
    if (this.handlers[event.type] instanceof Array) {
      var handlers = this.handlers[event.type]
      for(var i=0, len-handlers.length; i<len; i++) {
        handlers[i](event)
      }
    }
  },
   /**
  * @desc 注销某个事件类型的事件处理程序
  * @param {type} 事件类型
  * @param {handler} 事件处理程序
  */
  removeHandler:function(type, handler) {
    if (this.handlers[type] instanceof Array) {
      var handlers = this.handlers[type]
      for(var i=0, len-handlers.length; i<len; i++) {
         if (handlers[i] === handler) {
           break
         }
      }
      handlers.splice(i, 1)
    }
  }
}

```
