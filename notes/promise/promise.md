# Promise

- intro
  [Promise 流程图]('../assets/images/promise/promises.png')
- code
  [Promise 代码]('./promise.html')
- promise
  [Promise]('../../assets/images/promise/promise.png')

## attribute

Promise 自身的属性

- length
  其值总是为 1 (构造器参数的数目).
- Promise.prototype
  表示 Promise 构造器的原型.
- all: ƒ all()
- allSettled: ƒ allSettled()
- arguments: (...)
- caller: (...)
- length: 1
- name: "Promise"
- prototype: Promise {Symbol(Symbol.toStringTag): "Promise", constructor: ƒ, then: ƒ, catch: ƒ, finally: ƒ}
  - constructor
  - then
  - catch
  - finally
- race: ƒ race()
- reject: ƒ reject()
- resolve: ƒ resolve()
- Symbol(Symbol.species): (...)
- get Symbol(Symbol.species): ƒ [Symbol.species]()
- **proto**: ƒ ()
- [[Scopes]]: Scopes[0]

## API

1. Promise.all(iterable) iterable 可以是 Array 或者 String

   - Promise.all 当且仅当传入的可迭代对象为空时为同步
   - 当传入的可迭代对象全部成功时, 其状态自动变成 fulfilled
   - 当传入的可迭代对象错误, 其状态自动变成 rejected(只要一个不成功，状态自动变成 rejected)

2. Promise.race
   方法返回一个 promise，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝

3. Promise.resolve

4. Promise.reject

5. Promise.allSettled(iterable)
   - 方法返回一个在所有给定的 promise 已被决议或被拒绝后决议的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果
   - 一个可迭代的对象，例如 Array，其中每个成员都是 Promise
   - 这个方法可以在进行多个接口请求且不在乎其中的请求成功与否的时候进行使用
