# typeof
> 操作符返回一个字符串，表示未经计算的操作数的类型
> typeof operand
> or
> typeof (operand)
```js
	// 需要注意的是
	typeof null // object
	typeof new Boolean(true) // object
	typeof new Number(1) === 'object' // object
	typeof new String("abc") === 'object' // object

	// 函数
	typeof function(){} === 'function'
	typeof class C{} === 'function'
	typeof Math.sin === 'function'
	typeof new Function() === 'function'
```
* 缺点如上述的null之类的不能正常的进行判断
* 可以通过Object.prototype.toString.call来对类型进行更加准确的判断