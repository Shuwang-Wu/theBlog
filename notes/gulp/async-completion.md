<!--
 * @Author: shuwang_wu
 * @Date: 2021-05-24 19:45:13
 * @LastEditTime: 2021-05-24 20:06:24
 * @LastEditors: shuwang_wu
 * @Description: Async Completion
 * @FilePath: \notes\notes\gulp\async-completion.md
-->

# Async Completion

Node 库以多种方式处理异步功能。
最常见的模式是 error-first callbacks，但是你还可能会遇到 streams、promises、event emitters、child processes, 或 observables。
gulp 任务（task）规范化了所有这些类型的异步功能

## 任务（task）完成通知

### Return a stream

```js
const {src, dest} = require("gulp")
function streamWork () {
    return src("*.js").pipe(dest("output))
}
exports.default = streamWork
```

### Returning a promise

```js
function promiseTask() {
	return Promise.resolve('the value is ignore')
}
```

### Returning an event emitter

```js
const { EventEmitter } = require('events')

function eventEmitterTask() {
	const emitter = new EventEmitter()
	// Emit has to happen async otherwise gulp isn't listening yet
	setTimeout(() => emitter.emit('finish'), 250)
	return emitter
}

exports.default = eventEmitterTask
```

### Return a child process

```js
const { exec } = require('child_process')

function childProcessTask() {
	return exec('date')
}

exports.default = childProcessTask
```

### Returning an observable

```js
const { exec } = require('child_process')

function childProcessTask() {
	return exec('date')
}

exports.default = childProcessTask
```

### Return a observable

```js
const { Observable } = require('rxjs')

function observableTask() {
	return Observable.of(1, 2, 3)
}

exports.default = observableTask
```

### Return an error-first callback

如果任务（task）不返回任何内容，则必须使用 callback 来指示任务已完成。在如下示例中，callback 将作为唯一一个名为 cb() 的参数传递给你的任务（task）。

```js
function callbackTask(cb) {
	// `cb()` should be called by some async work
	cb()
}

exports.default = callbackTask
```

如需通过 callback 把任务（task）中的错误告知 gulp，请将 Error 作为 callback 的唯一参数

```js
function callbackError(cb) {
	// `cb()` should be called by some async work
	cb(new Error('kaboom'))
}

exports.default = callbackError
```

然而，你通常会将此 callback 函数传递给另一个 API ，而不是自己调用它。

```js
const fs = require('fs')

function passingCallback(cb) {
	fs.access('gulpfile.js', cb)
}

exports.default = passingCallback
```

### No synchronous tasks

gulp 不再支持同步任务（Synchronous tasks）了。因为同步任务常常会导致难以调试的细微错误，例如忘记从任务（task）中返回 stream。
当你看到 "Did you forget to signal async completion?" 警告时，说明你并未使用前面提到的返回方式。
你需要使用 callback 或返回 stream、promise、event emitter、child process、observable 来解决此问题。

### Using async/await

```js
const fs = require('fs')

async function asyncAwaitTask() {
	const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	console.log(version)
	await Promise.resolve('some result')
}

exports.default = asyncAwaitTask
```
