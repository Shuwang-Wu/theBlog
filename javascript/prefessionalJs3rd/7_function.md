# 函数表达式

函数表达式的特征
使用函数实现递归
使用闭包定义私有变量

1. 函数声明
   关于函数声明, 它的一个重要特征就是函数声明提升，意思就是在执行代码之前会先读取函数声明
2. 函数表达式
   即创建一个函数并将它复制给变量
   匿名函数：因为 function 关键字后面没有标识符（也叫拉姆达函数）

## 递归

```js
function factorial(num) {
  if (num >= 1) {
    return num * factorial(num--)
  } else {
    return 1
  }
}
```

arguments.callee
是一个指向正在执行函数的一个指针

```js
function factorial(num) {
  if (num >= 1) {
    return num * arguments.callee(num--)
  } else {
    return 1
  }
}
```

但是在严格模式下不能通过脚本来访问 arguments.callee, 这时可以使用匿名函数来代替

```js
var factorial = function f(num) {
  if (num >= 1) {
    return num * f(num--)
  } else {
    return 1
  }
}
```

## 闭包

指的是有权访问另一个函数作用域中的变量的函数

当某个函数执行时，会创建一个执行环境即相应的作用域链，并把作用域链赋值给一个特殊的内部属性(\[\[scope\]\]),
然后使用 this 和 arguments 和其他命名参数来初始化函数的活动对象。
但在作用域链中外部函数的活动对象始终处于第二位，外部函数的外部函数处于第三位...直至作为终点的全局执行环境(即一直到顶层的 window)

### 闭包和变量

作用域链的这种配置机制引出一个值得注意的副作用, 即闭包只能取得包含函数中任何变量的最后一个值

### 关于 this 对象

this 对象是在运行时基于函数的执行环境绑定的

### 内存泄漏

## 模仿块级作用域

## 私有变量

严格来讲，js 中没有私有成员的概念；所有对象的属性都是公有的。

### 静态私有变量

多查找作用域链中的一个层次就会在一定程度上影响查找速度，而这正是使用闭包和私有变量的一个显明的不足之处

### 模块模式

前面的模式是用于为自定义类型创建私有变量和特权方法的。而道格拉斯所说的模块模式则是为单例创建私有变量和特权方法；
所谓单例值的就是只有一个实例的对象

模式模块通过为单例添加私有变量和特权方法能够使其得到增强

```js
var singleton = function() {
  // 私有变量和私有函数
  var privateVariable = 0
  function privateFunction() {
    return false
  }
  // 特权/公有方法和属性
  return {
    publicProperty: true,
    publicMethod: function() {
      privateVariable++
      return privateFunction()
    }
  }
}
```

### 增强的模块模式
