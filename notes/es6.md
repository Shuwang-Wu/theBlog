#ES6

## class

更接近传统语言的写法, 它的绝大功能 ES5 都可以做到

```js
class Point {
  // constructor 方法是类的默认方法, 通过new命令生成对象时，自动调用该方法
  // 如果没有显示定义, 会默认生成constructor(){}
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  // 注意: 类的方法都是定义在它的原型上的，是不可以枚举的
  toString() {}
  toValueof() {}
}
typeof Point // function
Point = Point.prototype.constructor // true
```

1. 不存在变量提升
2. 也可以用表达式来进行声明

```js
const myCls = class Me {
  getClassName() {
    return Me.name
  }
}
```

3. 私有方法
   > ES6 不提供私有方法，只能在命名上变通来模拟实现

```js
// 方式1
class Point {
  constructor() {}
  foo() {} // 公有方法
  _foo() {} // 私有方法
}
// 方式2
class Point {
  constructor() {}
  foo() {
    _foo.call(this)
  } // 公有方法
}
function _foo() {}
// 方式3
const bar = Symbol('bar')
const snaf = Symbol('snaf')
export default class myClass {
  foo(baz) {
    this[bar](baz)
  }
  [bar](baz) {
    return (this[snaf] = baz)
  }
}
```

4. this 的指向
   如果含义 this, 默认指向类的实例

```js
class myClass {
  init() {
    this.print()
  }
  print(name) {
    console.log(name)
  }
}
let { print } = myClass
// this指的是运行时的环境
print() // TypeError: Cannot read property 'print' of undefined

// 方式1：在构造函数中绑定this
constructor() {
  this.print = this.print.bind(this)
}
```

5. 继承
   通过 extend 来实现继承

```js
class b {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  method1() {}
}
class a {
  constructor(x, y, z) {
    super(x, y)
    this.z = z
  }
  method1() {}
}
class a extends b {
  constructor() {}
}
```

6. 类的 prototype 属性和 proto 属性
   子类的 proto 属性, 表示构造函数的继承, 总是指向父类
   子类的 prototype 属性 proto 属性, 表示方法的继承, 总是指向父类的 prototype 属性

```js
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true

// extends的实现原理
class A {}
class B {}
// B的实例继承A的实例
Object.setPrototypeOf(B.prototype, A.prototype)
// B继承A的静态属性
Object.setPrototypeOf(B, A)

// setPrototypeOf实现原理
Object.setPrototypeOf = function(obj, proto) {
  obj.__proto__ = proto
  return obj
}
```

## set

新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。
利用这个特性我们可以进行数组去重

```js
let arr = [1, 1, 2, 2, 3, 3]
let s = new Set(arr)
console.log(s)
/**  s打印结果
  size: (...)
  __proto__: Set
    add: ƒ add()
    clear: ƒ clear()
    constructor: ƒ Set()
    delete: ƒ delete()
    entries: ƒ entries()
    forEach: ƒ forEach()
    has: ƒ has()
    keys: ƒ values()
    size: (...)
    values: ƒ values()
    Symbol(Symbol.iterator): ƒ values()
    Symbol(Symbol.toStringTag): "Set"
    get size: ƒ size()
  __proto__: Object
    [[Entries]]: Array(3)
      0: 1
      1: 2
      2: 3
*/

// 将set转化成数组
arr = Array.from(s)
```

## WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合,但是，它与 Set 有两个区别。
首先，WeakSet 的成员只能是对象，而不能是其他类型的值。
WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用

```js
let ws = new WeakSet()
```

## Map

出现的原因是因为 js 中对象是键值对集合，而且键值只能由字符串来组成; 为了可以让对象也能成为键值，所以引入了 map

```js
var m = new Map()
var o = { p: 'Hello World' }

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

接受一个数组为参数

```js
var m = new Map([['name', 'kobe'], ['age', 17]])
m.has('name') // true
m.get('name') // kobe
m.has('age') // true
m.get('age') // 17
// 上面的代码相当于
var items = [['name', 'kobe'], ['age', 17]]
var m = new Map()
items.forEach(([key, value]) => m.set(value[0], value[1]))
```

## WeakMap

## Proxy

用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程
可以理解成在目标对象之前架设一层拦截，外界对该对象的访问，都必须通过这层拦截

```js
var obj = new Proxy(
  {},
  {
    get: function(target, key, receiver) {},
    set: function(target, key, value, receiver) {}
  }
)
```

属性

1. get(target, propKey, receiver)
   拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']
2. set(target, propKey, value, receiver)
   拦截对象属性的设置
3. has(target, propKey)
   拦截 propKey in proxy 的操作，以及对象的 hasOwnProperty 方法，返回一个布尔值。
4. deleteProperty(target, propKey)
   拦截 delete proxy[propKey]的操作，返回一个布尔值。
5. ownKeys(target)
   拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)，返回一个数组。该方法返回对象所有自身的属性，而 Object.keys()仅返回对象可遍历的属性。
6. getOwnPropertyDescriptor(target, propKey)
   拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象
7. defineProperty(target, propKey, propDesc)
   拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
8. preventExtensions(target)
   拦截 Object.preventExtensions(proxy)，返回一个布尔值
9. getPrototypeOf(target)
   拦截 Object.getPrototypeOf(proxy)，返回一个对象。
10. isExtensible(target)
    拦截 Object.isExtensible(proxy)，返回一个布尔值。
11. setPrototypeOf(target, proto)
    拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值。
12. apply(target, object, args)
    拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
13. construct(target, args)
    拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。即用于拦截 new 命令
    可以接收两个参数, target：目标对象， args：构建函数的参数对象
    ```js
    var handler = {
      constructor(target, args, newTarget) {
        return new target(...args)
      }
    }
    ```
14. apply
    > apply 方法拦截函数的调用、call 和 apply 操作。
    ```js
    var target = function() {
      return 'target'
    }
    var handler = {
      apply: function() {
        return 'apply'
      }
    }
    var proxy = new Proxy(target, handler)
    proxy()
    ```

## Reflect

Reflect 对象与 Proxy 对象一样，也是 ES6 为了操作对象而提供的新 API

### 设计的目的

1. 将 object 对象的一些明显属于语言内部的方法, 放到 Reflect 对象上
2. 修改某些 Object 方法的返回结果

```js
try {
  Object.defineProperty(target, property, attributes)
} catch (e) {
  // code...
}
// 改成
if (Reflect.defineProperty(target, property, attributes)) {
  // you code
} else {
  // you code
}
```

3. 让 Object 操作编程函数行为

```js
// 某些Object的操作是命令式的, e.g.:
'assign' in Object // true
// 但是通过Reflect可以让它们编程函数行为
Reflect.has(Object, 'assign')
```

4. Reflect 方法跟 Proxy 的方法一一对应

```js
Proxy(target, {
  set: function(target, name, value, receiver) {
    var success = Reflect.set(target.name, value, receiver)
    if (success) {
      // code ...
    }
    return success
  }
})
```

### 方法

1. get
   > 查找并返回对象的属性值, 如果没有则返回 undefined; 该方法设置了读取函数则读取函数的 this 指向处理函数

```js
var obj = {
  get foo() {
    return this.bar()
  },
  bar: function() {}
}
// this指向handler
Reflect.get(obj, 'foo', handler)
```

2. set
   属性的读取, 与 get 相同
3. has(obj, name)
   等同于 property in object
4. deleteProperty(obj, name)
   等同于 delete obj[name]
5. construct(target, args)
   等同于 new target(...args)，这提供了一种不使用 new，来调用构造函数的方法
6. getPrototypeOf(obj)
   读取对象的**proto**属性，对应 Object.getPrototypeOf(obj)
7. setPrototypeOf(obj, newProto)
   设置对象的**proto**属性，对应 Object.setPrototypeOf(obj, newProto)
8. apply(fun,thisArg,args)
   等同于 Function.prototype.apply.call(fun,thisArg,args)
   如果函数定义了自己的 apply 方法，就只能写成 Function.prototype.apply.call(fn, obj, args)，采用 Reflect 对象可以简化这种操作

```js
// 失败时抛出错误
Object.defineProperty(obj, name, desc)
// 失败时返回false
Reflect.defineProperty(obj, name, desc)
```

### 使用 Proxy 实现观察者模式

```js
const queuedObservers = new Set()

const observe = fn => queuedObservers.add(fn)
const observable = obj => new Proxy(obj, { set })

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver)
  queuedObservers.forEach(observer => observer())
  return result
}
```

## iterator(遍历器)

### 作用

1. 一是为各种数据结构，提供一个统一的、简便的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. ES6 创造了一种新的遍历命令 for...of 循环, Iterator 接口主要供 for...of 消费

### 遍历过程

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象
2. 第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员
4. 不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

   每一次调用 next 都会返回 value 和 done 两个属性的对象, 下面例子模仿 next 实现:

   ```js
   function makeIterator(arr) {
     var nextIndex = 0
     return function() {
       nextIndex++
       if (nextIndex > arr.length) {
         return { value: undefined, done: true }
       } else {
         return { value: arr[nextIndex], done: false }
       }
     }
   }
   ```

### 调用 iterator 接口的场合

1. 结构赋值
2. 扩展运算符

```js
let str = '11111'
[...str] // ['1','1','1','1','1']
```

3. yield\*

   yield\*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口

   ```js
   let generator = function*() {
     yield 1
     yield* [2, 3, 4]
     yield 5
   }
   var iterator = generator()
   iterator.next() // { value: 1, done: false }
   iterator.next() // { value: 2, done: false }
   iterator.next() // { value: 3, done: false }
   iterator.next() // { value: 4, done: false }
   iterator.next() // { value: 5, done: false }
   iterator.next() // { value: undefined, done: true }
   ```

4. 字符串的 Iterator 接口

   字符串是一个类似数组的对象，也原生具有 Iterator 接口

   ```js
   var someString = 'hi'
   typeof someString[Symbol.iterator]
   // "function"

   var iterator = someString[Symbol.iterator]()

   iterator.next() // { value: "h", done: false }
   iterator.next() // { value: "i", done: false }
   iterator.next() // { value: undefined, done: true }
   ```

5. Generator 函数实现 iterator

```js
var myIterable = {}

myIterable[Symbol.iterator] = function*() {
  yield 1
  yield 2
  yield 3
}
;[...myIterable] // [1, 2, 3]
```

## async 函数

ES6 诞生以前，异步编程的方法，大概有下面四种。

1. 回调函数
2. 事件监听
3. 发布/订阅
4. Promise 对象

### 异步

简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段

1. 回调函数

```js
fs.readFile('etc/passwd', function(err, data) {
  if (err) throw err
  console.log(data)
})
```

2. promise
   为了解决回调函数的多层嵌套问题, 改成链式调用

3. Generator 函数

4. Thunk 函数
   编译器的"传名调用"实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。

```js
// ES5版本
var Thunk = function(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    return function(callback) {
      args.push(callback)
      return fn.apply(this, args)
    }
  }
}

// ES6版本
var Thunk = function(fn) {
  return function(...args) {
    return function(callback) {
      return fn.call(this, ...args, callback)
    }
  }
}
var readFileThunk = Thunk(fs.readFile)
readFileThunk(fileA)(callback)
```

5. Thunkify 模块
   生产环境的转换器，建议使用 Thunkify 模块。
   首先是安装

   > \$ npm install thunkify
   > 使用方式如下：

   ```js
   var thunkify = require('thunkify')
   var fs = require('fs')
   var read = thunkify(fs.readFile)
   read('package.json')(function(err, str) {
     // ...
   })
   ```

   Thunkify 源码

   ```js
   function thunkify() {
     return function() {
       var args = new Array(arguments.length)
       var ctx = this

       for (var i = 0; i < args.length; ++i) {
         args[i] = arguments[i]
       }
       return function() {
         var called
         args.push(function(done) {
           if (called) return
           called = true
           done.apply(null, arguments)
         })
         try {
           fn.apply(ctx, args)
         } catch (err) {
           done(err)
         }
       }
     }
   }
   ```
