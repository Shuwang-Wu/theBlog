# javascript 面试题收集
+ ["1", "2", "3"].map(parseInt)
> parseInt(1, 0) => 1
> parseInt(2, 1) => 1 
> parseInt(3, 2) => 1
+ 当设置padding为 ~% 的时候，计算的基准是屏幕的宽度

+ add(1)(2)(3)
+ 闭包实现累加效果
```js
	function add(x) {
		let sum = x
		let calc = function (y) {
			sum = sum + y
			return tmp
		}
		tmp.toString = function (sum) {
			return sum
		}
		return calc
	}
	console.log(add(1)(2)(3));  //6
	console.log(add(1)(2)(3)(4));   //10
```

+ [typeof][./assets/js/typeof.md]

+ 利用Math.max求出数组中的最大数
> Math.max() 可以接收n个参数
```js
	var arr = [1, 1000, 7, 5, 3, 9, 100];
	Math.max(arr); // NaN
	Math.max(...[arr]); // 1000
	// 这里apply会将传入的数组进行拆分，达到数组解构的效果
	var max2 = Math.max.apply(null, arr);
	// 使用call需要
```
* * *
+ 事件添加 addEvent.js
```js
	var lis = document.querySelectorAll("#test li");
	[1,2,3].map(function(lielem, key) {
		console.log(lielem, key);
	});
	Array.prototype.slice.call(lis).map(function(lielem, key) {
		lielem.addEventListener("click", () => {
			alert(key);
		});
	});
```
* * *
+ parseInt(string, radix)
	+ string
		> 要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用  ToString 抽象操作)。字符串开头的空白符将会被忽略。
	+ radix
		> 一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的基数。比如参数"10"表示使用我们通常使用的十进制数值系统。始终指定此参数可以消除阅读该代码时的困惑并且保证转换结果可预测。当未指定基数时，不同的实现会产生不同的结果，通常将值默认为10。
```js
	[1, 2, 3].map(parseInt);
	// 1.因为parseInt可以传入两个参数
	// 2.然后map返回两个参数(v, k)
	// 因此可以看成
	parseInt(1, 0) => 1
	parseInt(2, 1) => NaN
	parseInt(3, 2) => NaN
```
* * *
+ script变量提升
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
+ 缓存与不缓存的设置
```js
	<!-- 下面的两个meta用来设置浏览器的缓存，单位s -->
	<meta http-equiv="Cache-Control" content="max-age=7200" />
	<meta http-equiv="Expires" content="Mon, 20 Jul 2013 23:00:00 GMT" >
	<!-- 下面的两个meta用来设置浏览器的不缓存 -->
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0"> 
```

+ 实现一个[lazyMan](./assets/js/LazyMan.js),可以按照以下方式调用:
	+ 题目考点：
		1. 方法的链式调用
		2. 类的使用和面向编程的思路
		3. 设计模式的使用
		4. 代码的解耦
		5. 最少知识原则，即 迪米特原则
		6. 代码的书写结构和命名
	思路：
		从题目看，可以确定是拟人化的输出；
		首先，应该是一个类来描述这一类人，它具有吃饭，睡觉等行为；
		然后，从三个例子来看，都需要调用LazyMan来进行初始化；
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
+ [排序](./assets/js/Sort.js)
+ [map](./assets/js/map.js)
