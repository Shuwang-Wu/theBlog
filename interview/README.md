# javascript 面试题收集

- ["1", "2", "3"].map(parseInt)
  > parseInt(1, 0) => 1
  > parseInt(2, 1) => 1
  > parseInt(3, 2) => 1
- 当设置 padding 为 ~% 的时候，计算的基准是屏幕的宽度

- add(1)(2)(3)
- 闭包实现累加效果

```js
function add(x) {
  let sum = x
  let calc = function(y) {
    sum = sum + y
    return tmp
  }
  tmp.toString = function(sum) {
    return sum
  }
  return calc
}
console.log(add(1)(2)(3)) //6
console.log(add(1)(2)(3)(4)) //10
```

- [typeof][./assets/js/typeof.md]

- 利用 Math.max 求出数组中的最大数
  > Math.max() 可以接收 n 个参数

```js
var arr = [1, 1000, 7, 5, 3, 9, 100]
Math.max(arr) // NaN
Math.max(...[arr]) // 1000
// 这里apply会将传入的数组进行拆分，达到数组解构的效果
var max2 = Math.max.apply(null, arr)
// 使用call需要
```

---

- 事件添加 addEvent.js

```js
var lis = document.querySelectorAll('#test li')
;[1, 2, 3].map(function(lielem, key) {
  console.log(lielem, key)
})
Array.prototype.slice.call(lis).map(function(lielem, key) {
  lielem.addEventListener('click', () => {
    alert(key)
  })
})
```

---

- parseInt(string, radix) + string > 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。 + radix > 一个介于 2 和 36 之间的整数(数学系统的基础)，表示上述字符串的基数。比如参数"10"表示使用我们通常使用的十进制数值系统。始终指定此参数可以消除阅读该代码时的困惑并且保证转换结果可预测。当未指定基数时，不同的实现会产生不同的结果，通常将值默认为 10。

```js
	[1, 2, 3].map(parseInt);
	// 1.因为parseInt可以传入两个参数
	// 2.然后map返回两个参数(v, k)
	// 因此可以看成
	parseInt(1, 0) => 1
	parseInt(2, 1) => NaN
	parseInt(3, 2) => NaN
```

---

- script 变量提升

```js
	<script>
		var string = "test";
		arrFun([1]);
	</script>

	<script>
		document.write('<scr'+'ipt>console.log(string);arrFun([1]);console.log(num);<'+"/script>");
	</script>

	<script>
		var num = 666;
		function arrFun(arr) {
			if (arr instanceof Array) {
				console.log(arr);
			}
		}
	</script>
```

- 缓存与不缓存的设置

```js
	<!-- 下面的两个meta用来设置浏览器的缓存，单位s -->
	<meta http-equiv="Cache-Control" content="max-age=7200" />
	<meta http-equiv="Expires" content="Mon, 20 Jul 2013 23:00:00 GMT" >
	<!-- 下面的两个meta用来设置浏览器的不缓存 -->
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
```

- 实现一个[lazyMan](./assets/js/LazyMan.js),可以按照以下方式调用: + 题目考点： 1. 方法的链式调用 2. 类的使用和面向编程的思路 3. 设计模式的使用 4. 代码的解耦 5. 最少知识原则，即 迪米特原则 6. 代码的书写结构和命名
  思路：
  从题目看，可以确定是拟人化的输出；
  首先，应该是一个类来描述这一类人，它具有吃饭，睡觉等行为；
  然后，从三个例子来看，都需要调用 LazyMan 来进行初始化；
  最后，调用顺序是按次序来执行的，所以这是一个队列；
  建议参考[网址](http://www.jianshu.com/p/f1b7cb456d37./scripts/LazyMan.js)

```js
	LazyMan(“Hank”)输出:
	// Hi! This is Hank!
	LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
	// Hi! This is Hank!
	//等待10秒..
	// Wake up after 10
	// Eat dinner~
	LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
	// Hi This is Hank!
	// Eat dinner~
	// Eat supper~
	LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
	//等待5秒
	// Wake up after 5
	// Hi This is Hank!
	// Eat supper
```

- [排序](./assets/js/Sort.js)
  > 常用排序方法
- [map](./assets/js/map.js)
  > Array.prototype.map 实现方式
- [product](./assets/html/computeMaxProduct.js)
  > 计算传入数组中三个元素的最大乘积
- 闭包题目

```js
function a() {
  var temp = 1
  return function(x) {
    console.log(x + temp++)
  }
}
var b = a
var c1 = a()
var c2 = b()
c1(3)
c1(3)
c2(3)
```

- 在 javascript 中创造一个私有方法会导致任何实例化出来的对象都会复制一份，所以除非必要，否则不要创建私有方法

- 函数的执行上下文
- 执行环境
- global code 默认环境， 你代码首次进入的地方
- function code 当代码执行到函数体中
- eval 在 eval 函数内执行的文本
  > 有且只能有 1 个 全局上下文, 并且可以被程序中其他的上下文访问到。你可以有很多个 函数上下文, 每个函数调用都创造一个新的上下文, 并创建出一个局部作用域，任何在作用域内部声明的东西都不能被当前函数作用域外部访问到

* 调用栈 call stack

  > 调用栈是解析器的一种机制，可以在脚本调用多个函数时，跟踪每个函数在完成执行时应该返回控制的点

      	- 当函数调用的时候，解析器把该函数推到栈中
      	- *当执行函数占用的空间比当前栈分配的空间还大的时候，报栈溢出错误
      	- 执行完函数之后，在把该函数推出栈

```js
function greeting() {
  console.log('greeting')
  sayHi()
}

function sayHi() {
  console.log('sayHi')
}

greeting()
```

- 解析 Uncaught RangeError: Maximum call stack size exceeded
- 出现的原因: 出现调用自身的死循环会导致溢栈的结果
- 计算浏览器有多深的调用

```js
function computeMaxCallStackSize() {
  try {
    return 1 + computeMaxCallStackSize()
  } catch (e) {
    // Call stack overflow
    return 1
  }
}
// 上面这段代码会返回当前浏览器运行环境的最大调用栈
// 当在其中声明变量的时候其返回值会变小
```

- 尾调用优化
  > ECMAScript 6 支持尾递归优化：如果一个函数的最后一个操作是函数调用，那么将会用“跳转”而不是“子调用”。也就是说如果你将 computeMaxCallStackSize 重写成如下形式，在 ES6 的严格模式下，就会一直运行了。

```js
function computeMaxCallStackSize(size) {
  size = size || 1
  return computeMaxCallStackSize(size)
}
```

[浏览器与 Node 的事件循环(Event Loop)有何区别?](./20190312.md)

[debounce throttle](./assets/js/debounce-throttle.js)
