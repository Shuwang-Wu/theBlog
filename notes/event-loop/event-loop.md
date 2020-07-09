# Event Loop

## 浏览器中的 event-loop

- task queue
  [task queue]('../../assets/images/event-loop/event-loop.jpg')

- macrotask (宏队列)
  setTimeout
  setInterval
  setImmediate (Node 独有)
  requestAnimationFrame (浏览器独有)
  I/O
  UI rendering (浏览器独有)
- microtask (微队列)
  process.nextTick (Node 独有)
  Promise
  Object.observe
  MutationObserver

- example 1

  ```js
  // step 1
  console.log(1);
  // step 2
  setTimeout(() => {
    console.log(2);
    Promise.resolve().then(() => {
      console.log(3);
    });
  });
  // step 3
  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then(data => {
    console.log(data);
  });
  // step 4
  setTimeout(() => {
    console.log(6);
  });
  // step 5
  console.log(7);
  // console.log
  // 1 4 7 5 2 3 6
  ```

- example 2

```js
console.log(1);

setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => {
    console.log(3);
  });
});

new Promise((resolve, reject) => {
  console.log(4);
  resolve(5);
}).then(data => {
  console.log(data);

  Promise.resolve()
    .then(() => {
      console.log(6);
    })
    .then(() => {
      console.log(7);

      setTimeout(() => {
        console.log(8);
      }, 0);
    });
});

setTimeout(() => {
  console.log(9);
});

console.log(10);

// 1 4 10 5 6 7 2 3 9 8
```

## Nodejs 中的 event-loop

- 执行全局 Script 的同步代码
- 执行 microtask 微任务，先执行所有 Next Tick Queue 中的所有任务，再执行 Other Microtask Queue 中的所有任务
- 开始执行 macrotask 宏任务，共 6 个阶段，从第 1 个阶段开始执行相应每一个阶段 macrotask 中的所有任务，注意，这里是所有每个阶段宏任务队列的所有任务，在浏览器的 Event Loop 中是只取宏队列的第一个任务出来执行，每一个阶段的 macrotask 任务执行完毕后，开始执行微任务，也就是步骤 2
- Timers Queue -> 步骤 2 -> I/O Queue -> 步骤 2 -> Check Queue -> 步骤 2 -> Close Callback Queue -> 步骤 2 -> Timers Queue ......
  这就是 Node 的 Event Loop

### macrotask

- [示例图]('../../assets/images/event-loop/macrotask-node.jpg')

  > timers => I/O callback => idle,prepare => poll => check => close callback => timers  
  > timers 阶段：这个阶段执行 setTimeout 和 setInterval 预定的 callback
  > I/O callback 阶段：执行除了 close 事件的 callbacks、被 timers 设定的 callbacks、setImmediate()设定的 callbacks 这些之外的 callbacks
  > idle, prepare 阶段：仅 node 内部使用
  > poll 阶段：获取新的 I/O 事件，适当的条件下 node 将阻塞在这里
  > check 阶段：执行 setImmediate()设定的 callbacks
  > close callbacks 阶段：执行 socket.on('close', ....)这些 callbacks

- Timers Queue
- I/O Callbacks Queue
- Check Queue
- Close Callbacks Queue

### microtask

- [示例图]('../../assets/images/event-loop/microtask-node.jpg')
- Next Tick Queue：是放置 process.nextTick(callback)的回调任务的
- Other Micro Queue：放置其他 microtask，比如 Promise 等

### example code

```js
console.log("start");

setTimeout(() => {
  // callback1
  console.log(111);
  setTimeout(() => {
    // callback2
    console.log(222);
  }, 0);
  setImmediate(() => {
    // callback3
    console.log(333);
  });
  process.nextTick(() => {
    // callback4
    console.log(444);
  });
}, 0);

setImmediate(() => {
  // callback5
  console.log(555);
  process.nextTick(() => {
    // callback6
    console.log(666);
  });
});

setTimeout(() => {
  // callback7
  console.log(777);
  process.nextTick(() => {
    // callback8
    console.log(888);
  });
}, 0);

process.nextTick(() => {
  // callback9
  console.log(999);
});

console.log("end");

// start end 999 111 777  444 888 555 666 222 333
```

### 有关于朴灵评注阮一峰

[doc]('./doc.md')
