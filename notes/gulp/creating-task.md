<!--
 * @Author: shuwang_wu
 * @Date: 2021-05-24 19:48:41
 * @LastEditTime: 2021-05-24 19:49:00
 * @LastEditors: shuwang_wu
 * @Description:
 * @FilePath: \notes\notes\gulp\creating-task.md
-->

# Creating Task

每个 gulp 任务（task）都是一个异步的 JavaScript 函数,
此函数是一个可以接收 callback 作为参数的函数,
或者是一个返回 stream、promise、event emitter、child process 或 observable (后面会详细讲解) 类型值的函数

## 导出任务

1. 公有任务(public.task)
   从 gulpfile 中被导出（export），可以通过 gulp 命令直接调用
2. 私有任务(private.task)
   被设计为在内部使用，通常作为 series() 或 parallel() 组合的组成部分

## 组合任务

Gulp 提供了两个强大的组合方法： series() 和 parallel()，允许将多个独立的任务组合为一个更大的操作。这两个方法都可以接受任意数目的任务（task）函数或已经组合的操作。series() 和 parallel() 可以互相嵌套至任意深度

如果需要让任务（task）按顺序执行，请使用 series() 方法

```js
const {} = require('gulp')
function transpile(cb) {
	// body omitte
	cb()
}
function bundle(cb) {
	// body omitte
	cb()
}
exports.build = series(transpile, bundle)
```

对于希望以最大并发来运行的任务（tasks），可以使用 parallel() 方法将它们组合起来

```js
const { parallel } = require('gulp')
function javascript(cb) {
	// body omitted
	cb()
}
function css(cb) {
	// body omitted
	cb()
}
exports.build = parallel(javascript, css)
```

当 series() 或 parallel() 被调用时，任务（tasks）被立即组合在一起。这就允许在组合中进行改变，而不需要在单个任务（task）中进行条件判断。

```js
const { series } = require('gulp')
function minify(cb) {
	cb()
}
function transpile(cb) {
	cb()
}
function livereload(cb) {
	cb()
}
if (process.env.NODE_ENV === 'development') {
	exports.build = series(transpile, minify)
} else {
	exports.build = series(transpile, livereload)
}
```

重构为：

```js
const { series, parallel } = require('gulp')

function clean(cb) {
	// body omitted
	cb()
}

function css(cb) {
	// body omitted
	cb()
}

function javascript(cb) {
	// body omitted
	cb()
}

exports.build = series(clean, parallel(css, javascript))
```
