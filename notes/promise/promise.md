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

   ```js
   var p = Promise.all([]).then(resArr => {
     console.log('sync then')
   }).catch(errs => {
     console.log('sync catch')
   })
   console.log('main', p)
   <!-- console.log -->
   // 从控制台的打印结果可以获得: 此时的promise status 已经变成了 resolved, 这反过来正好说明了这种写法是会导致同步的
   // main, Promise {pending} [[promiseStatus]]: "resolved"
   ```

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

## practice

- [Promise 相关题目]('https://juejin.im/post/5e58c618e51d4526ed66b5cf')

- 使用 Promise 实现每隔 1 秒输出 1,2,3

```js
/**
 * @name 使用Promise使其按顺序间隔1s输出1, 2, 3
 * */
const arr = [1, 2, 3];
const result = arr.reduce((p, x) => {
  return p.then(
    new Promise(r => {
      return setTimeout(() => r(console.log(x)), 1000);
    })
  );
}, Promise.resolve());
```

- 使用 Promise 实现红绿灯交替重复亮

```js
/**
 * @name 使用Promise实现红绿灯交替重复亮
 * @description 红灯3秒亮一次， 黄灯2秒亮一次， 绿灯1秒亮一次； 如何让三个灯不断交替重复亮灯？（ 用Promise实现） 三个亮灯函数已经存在
 * */
function red() {
  console.log("red");
}

function green() {
  console.log("green");
}

function yellow() {
  console.log("yellow");
}
const light = function(timer, cb) {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, timer);
  });
};
const step = function() {
  Promise.resolve()
    .then(() => {
      return light(3000, red);
    })
    .then(() => {
      return light(2000, green);
    })
    .then(() => {
      return light(1000, yellow);
    })
    .then(() => {
      return step();
    });
};

step();
```

- 实现 mergePromise 函数

```js
/**
 * @name 实现mergePromise函数
 * @description 具体题目如下所示
 * */
const time = timer => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timer);
  });
};
const ajax1 = () =>
  time(2000).then(() => {
    console.log(1);
    return 1;
  });
const ajax2 = () =>
  time(1000).then(() => {
    console.log(2);
    return 2;
  });
const ajax3 = () =>
  time(1000).then(() => {
    console.log(3);
    return 3;
  });

function mergePromise() {
  // 在这里写代码
}

mergePromise([ajax1, ajax2, ajax3]).then(data => {
  console.log("done");
  console.log(data); // data 为 [1, 2, 3]
});

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

```
