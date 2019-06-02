# 引用类型

本章内容

1. 使用对象
2. 创建并操作数组
3. 理解基本的 JavaScript 类型
4. 使用基本类型和基本包装类型

在 ecmascript 中，引用类型是一种数据结构，用于将数据和功能组织在一起
有时候也被成为对象定义, 因为它描述的是一类对象所具有的属性和方法

## Object 类型

```js
var obj = new Object()
var obj = {}
```

在使用对象字面量定义对象的时候不会调用 Object 构造函数

## Array 类型

创建数组的方式：

1. new Array(20) 或者 Array(20)创建长度为 20 的数组; new Array('a', 'b', 'c') 或者 Array(a', 'b', 'c')
2. var arr = [a', 'b', 'c']

在使用数组字面量定义对象的时候不会调用 Array 构造函数
数组的 length 属性不是只读的, 因此可以通过设置这个属性来移除项或者向数组中添加项

### 检测数组

```js
// mode 1
if (val instanceof Array) {
  // 对数组执行某些操作
}
// mode 2
Array.isArray()
```

### 转化方法

```js
var arr = [1, 2, 3]
arr.toString() // 1,2,3
```

1. 调用 toString 方法会返回数组中每个值的字符串拼接而成的一个以逗号为间隔的字符串
2. 如果数组的某一项是 null 或者 undefined，则返回的字符串中该项以空字符串的形式表示

### 栈方法

使用 push 和 pop 可以实现栈的后进新出

### 队列方法

使用 push 和 shift 可以实现先进先出

### 重排序方法

1. reverse 翻转数组
2. sort 对数组进行排序
   默认按照升序来进行排列
   默认会调用每个数组项的 toString 方法，然后再比较得到的字符串，以确定如何排序

### 操作方法

1. concat()
2. slice()
3. splice()
   删除 可以删除任意数量的项
   插入
   替换

### 迭代方法

1. every
2. filter
3. forEach
4. map
5. some

### 缩小方法

接收 4 个参数: 前一个值, 当前值, 项的索引和数组对象
都会迭代数组所有项，然后构建一个返回值
第一次迭代发生在数组的第二项

1. reduce
2. reduceRight

```js
var arr = [1, 2, 3, 4, 5]
arr.reduce()
```

## Date 类型

Date 类型在早期 Java 中的 java.util.Date 类基础上构建
Date.UTC 和 Date.parse 返回表示日期的毫秒数
Date.now() 返回当前时间的毫秒数

## RegExp 类型

/reg/gi 字面量形式只是创建了一个 RegExp 实例
new RegExp('reg', 'gi') 每次迭代都会创建一个新的 RegExp 实例

### 实例属性

1. global: 布尔值, 表示是否设置了 g 标志
2. ignoreCase: 布尔值, 表示是否忽略大小写
3. lastIndex: 布尔值, 表示开始搜索下一个匹配项的字符位置, 从 0 算起
4. multiline: 布尔值, 表示是否设置了 m 标志
5. source: 正则表达式的字符串表示

### 实例方法

1. exec
   接受一个参数, 返回包含第一个匹配项信息的数组, 但是包含两个额外的属性: index 和 input
   每次调用都会继续查询后面字符串中是否存在匹配项, 同时 lastIndex 也会继续进行累加

```js
var text = 'mom and dad and baby'
var pattern = /mom(and dad (and baby)?)?/gi
var matches = pattern.exec(text)
console.log(matches.index) // 0
console.log(matches.input) // mom and dad and baby
console.log(matches[0]) // mom and dad and baby
console.log(matches[1]) // and dad and baby
console.log(matches[2]) // and baby
```

2.test
返回 true 或者 false

### 构造函数属性

1. input 最近一次要匹配的字符串
2. lastMatch 最近一次的匹配项
3. lastParen 最近一次匹配的捕获组
4. leftContext input 字符串中 lastMatch 之前的字符串
5. rightContext input 字符串中 lastMatch 之前的字符串
6. multiline 布尔值, 表示是否所有表达式都使用多行模式

```js
var text = 'this has been a short summer'
var pattern = /(.)hort/g
/**
 * 注意: opera不支持input、lastMatch、lastParent和multiline属性
 * Internet Explorer不支持multiline属性
 */
if (pattern.test(text)) {
  console.log(RegExp.input) // 'this has been a short summer'
  console.log(RegExp.lastMatch) // 'short'
  console.log(RegExp.lastParen) // 's' ?
  console.log(RegExp.leftContext) // 'this has been a'
  console.log(RegExp.rightContext) // 'summer'
  console.log(RegExp.multiline) // 'false'
  console.log(RegExp.$_) // 'this has been a short summer'
  console.log(RegExp['$&']) // 'short'
  console.log(RegExp['$+']) // 's' ?
  console.log(RegExp['$`']) // 'this has been a'
  console.log(RegExp["$'"]) // 'summer'
  console.log(RegExp['$*']) // 'false'
}
```

除了上述的属性, 还有多大 9 个存储捕获组的构造函数属性，访问这些属性的语法是 RegExp.\$1, RegExp.\$2, RegExp.\$3

### 模式的局限性

查看高程 P110

## Function 类型

每个函数都是 Function 类型的实例, 而且都与其他引用类型一样具有属性和方法
由于函数时对象, 所有函数名实际上也是一个函数对象的指针, 不会与某个函数绑定

### 没有重载

将函数名想象成指针, 也有助于理解为什么 ECMAScript 中没有函数重载的概念

### 函数声明和函数表达式

1. 函数声明
   解析器会率先读取函数声明, 并使其在任何代码之前可用; 至于函数表达式, 则必须要等到解析器执行到它所在的代码行, 才会真正被解释执行
2. 函数表达式
   在函数表达式之前调用, 会报错, 因为函数位于一个初始化语句中, 在执行到函数所在的语句之前不会保存对函数的引用

### 作为值的函数

### 函数内部属性

1. arguments
   属性 callee，是一个指针，指向拥有这个 arguments 对象的函数 (严格模式下访问会报错)
2. this
   引用的是函数据以执行的环境对象
3. caller 指向调用当前函数的函数 (严格模式下访问会报错)

### 函数的属性和方法

- 属性
  1. length 表示每个函数希望接收的命名参数的个数
  2. prototype
- 方法
  1. call apply
     区别仅在于接收的参数不同
     上述两个方法的用途都是在特定作用域中调用函数, 实际上等于设置函数体内 this 对象和值
     使用 call 和 apply 来扩充作用域最大的好处是对象与方法不需要有任何的耦合关系
  2. bind
     这个方法会创建一个示例, 其 this 值会被绑定到传给 bind()函数的值
  3. toString toLocalString valueOf
     返回函数的代码

## 基本包装类型

Object 构造函数也会像工厂方法一样, 根据传入值的类型返回相应基本包装类型的实例

```js
var obj = new Obejct('some text')
alert(obj instanceof String) // true
```

使用 new 调用基本包装类型的构造函数, 与直接调用同名的转型函数是不一样的

```js
var value = '25'
var num1 = Number(value) // 转型函数, num1中保存的是基本类型的值25
typeof num1 // number
var num2 = new Number(value) // 构造函数, 保存的是Number实例
typeof num2 // object
```

### Boolean

建议永远不要使用 Boolean 对象

### Number

- 方法
  1. toFixed 按照指定的小数位返回数值的字符串表示
  2. toExponential 返回以指数表示法表示的数值字符串形式
  3. toPrecision 可能返回上述两个方法之一, 具体看哪种格式更合适

### String

1. 字符方法:
   charAt/charCodeAt 接收一个参数，即基于 0 的字符位置
2. 字符串与操作方法
   concat 用以将一个字符或者多个字符拼接起来返回得到的新的字符
   trim
   toLowerCase, toLocaleLowerCase, toUpperCase, toLocaleUpperCase
   localeCompare 比较两个字符串返回 xi

## 单体内置对象

对内置对象的定义是: 由 ECMAScript 实现提供的、不依赖于宿主环境的对象，这些对象在 ECMAScript 程序执行之前就已经存在了

### Global 对象

不属于任何其他对象的属性和方法, 最终都是它的属性和方法。
事实上，没有全局变量或全局函数，所有在全局作用域中定义的属性和函数， 都是 Global 对象的属性

1. URI 编码方法
   encodeURI/encodeURIComponent
   encodeURI 不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井号
2. eval
   通过 eval 执行的代码可以引用在包含环境中定义的变量
   ```js
   eval('function sayHi() {console.log("hi")}')
   sayHi() // 'hi'
   ```
3. Global 对象的属性
4. window 对象
   ECMAScript 没有指出如何直接访问 Global 对象，但 web 浏览器都是将这个对象作为 window 对象的一部分加以实现的；
   因此，在全局作用域中声明的所有变量和函数，就都成为了 window 对象的属性
   - js 中的 window 除了扮演 Global 对象的角色之外，还承担了很多别的任务

### Math 对象

保存数学公式和信息

1. Math 对象的属性(略)
2. min 和 max 方法
3. 舍入方法
   - Math.ceil 向上舍入
   - Math.floor 向下舍入
   - Math.round 四舍五入
4. random 方法
5. 其他方法
