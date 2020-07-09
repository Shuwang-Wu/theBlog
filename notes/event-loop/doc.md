<!--
 * @Description  :
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-06-19 11:01:24
 * @LastEditTime : 2020-06-19 11:20:16
 * @FilePath     : \notes\notes\event-loop\doc.md
-->

PS: 我先旁观下大师们的讨论，得多看书了~

别人说的：“看了一下不觉得评注对到哪里去，只有吹毛求疵之感。 比如同步异步介绍，本来就无大错；比如 node 图里面的 OS operation，推敲一下就可以猜到那是指同步操作（自然不走 event loop 了）；至于 watcher 啥的，显然只是实现上的特色，即使用同一个 queue 实现也未尝不可”

> 【原帖： http://www.ruanyifeng.com/blog/2014/10/event-loop.html 作者：阮一峰】
> 一年前，我写了一篇《什么是 Event Loop？》，谈了我对 Event Loop 的理解。

上个月，我偶然看到了 Philip Roberts 的演讲《Help, I'm stuck in an event-loop》。这才尴尬地发现，自己的理解是错的。我决定重写这个题目，详细、完整、正确地描述 JavaScript 引擎的内部运行机制。下面就是我的重写。

【JavaScript 引擎的内部运行机制跟 Event loop 没有半毛钱的关系。】
【这里的错误在于要分清楚 JavaScript 执行环境和执行引擎的关系，通常说的引擎指的是虚拟机，对于 Node 来说是 V8、对 Chrome 来说是 V8、对 Safari 来说 JavaScript Core，对 Firefox 来说是 SpiderMonkey。JavaScript 的执行环境很多，上面说的各种浏览器、Node、Ringo 等。前者是 Engine，后者是 Runtime。】
【对于 Engine 来说，他们要实现的是 ECMAScript 标准。对于什么是 event loop，他们没兴趣，不关心。】
【准确的讲，要说的应该是 Runtime 的执行机制。】

进入正文之前，插播一条消息。我的新书《ECMAScript 6 入门》出版了（版权页，内页 1，内页 2），铜版纸全彩印刷，非常精美，还附有索引（当然价格也比同类书籍略贵一点点）。预览和购买点击这里。

【新书还是要支持】

一、为什么 JavaScript 是单线程？

JavaScript 语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。那么，为什么 JavaScript 不能有多个线程呢？这样能提高效率啊。

JavaScript 的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript 的主要用途是与用户互动，以及操作 DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定 JavaScript 同时有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

所以，为了避免复杂性，从一诞生，JavaScript 就是单线程，这已经成了这门语言的核心特征，将来也不会改变。

为了利用多核 CPU 的计算能力，HTML5 提出 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但是子线程完全受主线程控制，且不得操作 DOM。所以，这个新标准并没有改变 JavaScript 单线程的本质。

> 【这段没啥大问题，谢谢阮老师】

二、任务队列

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

如果排队是因为计算量大，CPU 忙不过来，倒也算了，但是很多时候 CPU 是闲着的，因为 IO 设备（输入输出设备）很慢（比如 Ajax 操作从网络读取数据），不得不等着结果出来，再往下执行。

JavaScript 语言的设计者意识到，这时 CPU 完全可以不管 IO 设备，挂起处于等待中的任务，先运行排在后面的任务。等到 IO 设备返回了结果，再回过头，把挂起的任务继续执行下去。

> 【这个跟 Brendan Eich 没半毛钱关系。进程在处理 IO 操作的时候，操作系统多半自动将 CPU 切给其他进程用了】

于是，JavaScript 就有了两种执行方式：一种是 CPU 按顺序执行，前一个任务结束，再执行下一个任务，这叫做同步执行；另一种是 CPU 跳过等待时间长的任务，先处理后面的任务，这叫做异步执行。程序员自主选择，采用哪种执行方式。

> 【纯粹扯蛋。】
> 【给 CPU 啥指令它就执行啥，哪有什么 CPU 跳过等待时间长的任务。】
> 【归根结底，阮老师没有懂什么叫异步。】

具体来说，异步执行的运行机制如下。（同步执行也是如此，因为它可以被视为没有异步任务的异步执行。）

【上面这句话表现出不仅不懂什么是异步，更不懂什么是同步。】
（1）所有任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。系统把异步任务放到"任务队列"之中，然后继续执行后续的任务。

（3）一旦"执行栈"中的所有任务执行完毕，系统就会读取"任务队列"。如果这个时候，异步任务已经结束了等待状态，就会从"任务队列"进入执行栈，恢复执行。

（4）主线程不断重复上面的第三步。

> 【上面这段初步地在说 event loop。但是异步跟 event loop 其实没有关系。准确的讲，event loop 是实现异步的一种机制】
> 【一般而言，操作分为：发出调用和得到结果两步。发出调用，立即得到结果是为同步。发出调用，但无法立即得到结果，需要额外的操作才能得到预期的结果是为异步。同步就是调用之后一直等待，直到返回结果。异步则是调用之后，不能直接拿到结果，通过一系列的手段才最终拿到结果（调用之后，拿到结果中间的时间可以介入其他任务）。】
> 【上面提到的一系列的手段其实就是实现异步的方法，其中就包括 event loop。以及轮询、事件等。】
> 【所谓轮询：就是你在收银台付钱之后，坐到位置上不停的问服务员你的菜做好了没。】
> 【所谓（事件）：就是你在收银台付钱之后，你不用不停的问，饭菜做好了服务员会自己告诉你。】

下图就是主线程和任务队列的示意图。

只要主线程空了，就会去读取"任务队列"，这就是 JavaScript 的运行机制。这个过程会不断重复。

> 【JavaScript 运行环境的运行机制，不是 JavaScript 的运行机制。】

三、事件和回调函数

"任务队列"实质上是一个事件的队列（也可以理解成消息的队列），IO 设备完成一项任务，就在"任务队列"中添加一个事件，表示相关的异步任务可以进入"执行栈"了。主线程读取"任务队列"，就是读取里面有哪些事件。

> 【任务队列既不是事件的队列，也不是消息的队列。】
> 【任务队列就是你在主线程上的一切调用。】
> 【所谓的事件驱动，就是将一切抽象为事件。IO 操作完成是一个事件，用户点击一次鼠标是事件，Ajax 完成了是一个事件，一个图片加载完成是一个事件】
> 【一个任务不一定产生事件，比如获取当前时间。】
> 【当产生事件后，这个事件会被放进队列中，等待被处理】
> "任务队列"中的事件，除了 IO 设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等）。只要指定过回调函数，这些事件发生时就会进入"任务队列"，等待主线程读取。

所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当异步任务从"任务队列"回到执行栈，回调函数就会执行。

> 【他们压根就没有被执行过，何来挂起之说？】
> 【异步任务不一定要回调函数。】
> 【从来就没有什么执行栈。主线程永远在执行中。主线程会不断检查事件队列】

"任务队列"是一个先进先出的数据结构，排在前面的事件，优先返回主线程。主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列"上第一位的事件就自动返回主线程。但是，由于存在后文提到的"定时器"功能，主线程要检查一下执行时间，某些事件必须要在规定的时间返回主线程。

> 【先产生的事件，先被处理。永远在主线程上，没有返回主线程之说】
> 【某些事件也不是必须要在规定的时间执行，有时候没办法在规定的时间执行】

四、Event Loop

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。

> 【事件驱动的的实现过程主要靠事件循环完成。进程启动后就进入主循环。主循环的过程就是不停的从事件队列里读取事件。如果事件有关联的 handle(也就是注册的 callback)，就执行 handle。一个事件并不一定有 callback】
> 为了更好地理解 Event Loop，请看下图（转引自 Philip Roberts 的演讲《Help, I'm stuck in an event-loop》）。

> 【所以上面的 callback queue，其实是 event queue】

上图中，主线程运行的时候，产生堆（heap）和栈（stack），栈中的代码调用各种外部 API，它们在"任务队列"中加入各种事件（click，load，done）。只要栈中的代码执行完毕，主线程就会去读取"任务队列"，依次执行那些事件所对应的回调函数。

执行栈中的代码，总是在读取"任务队列"之前执行。请看下面这个例子。

    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function (){};
    req.onerror = function (){};
    req.send();

上面代码中的 req.send 方法是 Ajax 操作向服务器发送数据，它是一个异步任务，意味着只有当前脚本的所有代码执行完，系统才会去读取"任务队列"。所以，它与下面的写法等价。

    var req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = function (){};
    req.onerror = function (){};

【等价个屁。这个调用其实有个默认回调函数，Ajax 结束后，执行回调函数，回调函数检查状态，决定调用 onload 还是 onerror。所以只要在回调函数执行之前设置这两个属性就行】

也就是说，指定回调函数的部分（onload 和 onerror），在 send()方法的前面或后面无关紧要，因为它们属于执行栈的一部分，系统总是执行完它们，才会去读取"任务队列”。

五、定时器
除了放置异步任务，"任务队列"还有一个作用，就是可以放置定时事件，即指定某些代码在多少时间之后执行。这叫做"定时器"（timer）功能，也就是定时执行的代码。

定时器功能主要由 setTimeout()和 setInterval()这两个函数来完成，它们的内部运行机制完全一样，区别在于前者指定的代码是一次性执行，后者则为反复执行。以下主要讨论 setTimeout()。

setTimeout()接受两个参数，第一个是回调函数，第二个是推迟执行的毫秒数。

console.log(1);
setTimeout(function(){console.log(2);},1000);
console.log(3);

上面代码的执行结果是 1，3，2，因为 setTimeout()将第二行推迟到 1000 毫秒之后执行。

如果将 setTimeout()的第二个参数设为 0，就表示当前代码执行完（执行栈清空）以后，立即执行（0 毫秒间隔）指定的回调函数。

setTimeout(function(){console.log(1);}, 0);
console.log(2);

上面代码的执行结果总是 2，1，因为只有在执行完第二行以后，系统才会去执行"任务队列"中的回调函数。

HTML5 标准规定了 setTimeout()的第二个参数的最小值（最短间隔），不得低于 4 毫秒，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为 10 毫秒。

另外，对于那些 DOM 的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每 16 毫秒执行一次。这时使用 requestAnimationFrame()的效果要好于 setTimeout()。

需要注意的是，setTimeout()只是将事件插入了"任务队列"，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在 setTimeout()指定的时间执行。

【定时器并不是特例。到达时间点后，会形成一个事件（timeout 事件）。不同的是一般事件是靠底层系统或者线程池之类的产生事件，但定时器事件是靠事件循环不停检查系统时间来判定是否到达时间点来产生事件】

六、Node.js 的 Event Loop
Node.js 也是单线程的 Event Loop，但是它的运行机制不同于浏览器环境。

请看下面的示意图（作者@BusyRich）。

【以我对 Node 的了解，上面这个图也是错的。】
【OS Operation 不在那个位置，而是在 event loop 的后面。event queue 在 event loop 中间】
【
js —> v8 —> node binding —> (event loop) —> worker threads/poll —> blocking operation
<— <— <—— (event loop)<—————— event <——————
】

根据上图，Node.js 的运行机制如下。

（1）V8 引擎解析 JavaScript 脚本。

（2）解析后的代码，调用 Node API。

（3）libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。

（4）V8 引擎再将结果返回给用户。

【完全不是不同的任务分配给不同的线程。只有磁盘 IO 操作才用到了线程池（unix）。】
【Node 中，磁盘 I/O 的异步操作步骤如下：】
【将调用封装成中间对象，交给 event loop，然后直接返回】
【中间对象会被丢进线程池，等待执行】
【执行完成后，会将数据放进事件队列中，形成事件】
【循环执行，处理事件。拿到事件的关联函数（callback）和数据，将其执行】
【然后下一个事件，继续循环】

除了 setTimeout 和 setInterval 这两个方法，Node.js 还提供了另外两个与"任务队列"有关的方法：process.nextTick 和 setImmediate。它们可以帮助我们加深对"任务队列"的理解。
process.nextTick 方法可以在当前"执行栈"的尾部----主线程下一次读取"任务队列"之前----触发回调函数。也就是说，它指定的任务总是发生在所有异步任务之前。setImmediate 方法则是在当前"任务队列"的尾部触发回调函数，也就是说，它指定的任务总是在主线程下一次读取"任务队列"时执行，这与 setTimeout(fn, 0)很像。请看下面的例子（via StackOverflow）。

process.nextTick(function A() {
console.log(1);
process.nextTick(function B(){console.log(2);});
});

setTimeout(function timeout() {
console.log('TIMEOUT FIRED');
}, 0)
// 1
// 2
// TIMEOUT FIRED

上面代码中，由于 process.nextTick 方法指定的回调函数，总是在当前"执行栈"的尾部触发，所以不仅函数 A 比 setTimeout 指定的回调函数 timeout 先执行，而且函数 B 也比 timeout 先执行。这说明，如果有多个 process.nextTick 语句（不管它们是否嵌套），将全部在当前"执行栈"执行。

现在，再看 setImmediate。

setImmediate(function A() {
console.log(1);
setImmediate(function B(){console.log(2);});
});

setTimeout(function timeout() {
console.log('TIMEOUT FIRED');
}, 0)
// 1
// TIMEOUT FIRED
// 2

上面代码中，有两个 setImmediate。第一个 setImmediate，指定在当前"任务队列"尾部（下一次"事件循环"时）触发回调函数 A；然后，setTimeout 也是指定在当前"任务队列"尾部触发回调函数 timeout，所以输出结果中，TIMEOUT FIRED 排在 1 的后面。至于 2 排在 TIMEOUT FIRED 的后面，是因为 setImmediate 的另一个重要特点：一次"事件循环"只能触发一个由 setImmediate 指定的回调函数。

我们由此得到了一个重要区别：多个 process.nextTick 语句总是一次执行完，多个 setImmediate 则需要多次才能执行完。事实上，这正是 Node.js 10.0 版添加 setImmediate 方法的原因，否则像下面这样的递归调用 process.nextTick，将会没完没了，主线程根本不会去读取"事件队列”！

【10.0 版就不用纠正了吧】

process.nextTick(function foo() {
process.nextTick(foo);
});

事实上，现在要是你写出递归的 process.nextTick，Node.js 会抛出一个警告，要求你改成 setImmediate。另外，由于 process.nextTick 指定的回调函数是在本次"事件循环"触发，而 setImmediate 指定的是在下次"事件循环"触发，所以很显然，前者总是比后者发生得早，而且执行效率也高（因为不用检查"任务队列"）。

关于 setImmediate 与 setTimeout(fn,0)的区别是，setImmediate 总是在 setTimeout 前面执行，除了主线程第一次进入 Event Loop 时。请看下面的例子。

setTimeout(function () {
console.log('1');
},0);

setImmediate(function () {
console.log('2');
})

上面代码的运行结果不确定，有可能是 1，2，也有可能是 2，1，即使 setTimeout 和 setImmediate 两个函数互换位置，也是如此。因为这些代码是主线程第一次读取 Event Loop 之前运行。但是，如果把这段代码放在 setImmediate 之中，结果就不一样。

setImmediate(function () {
setTimeout(function () {
console.log('1');
},0);

setImmediate(function () {
console.log('2');
})
})

上面代码运行结果总是 2，1，因为进入 Event Loop 之后，setImmediate 在 setTimeout 之前触发。
【还是会出现 1， 2 的情况。呵呵。不信试试】

（完）

【准确讲，使用事件驱动的系统中，必然有非常非常多的事件。如果事件都产生，都要主循环去处理，必然会导致主线程繁忙。那对于应用层的代码而言，肯定有很多不关心的事件（比如只关心点击事件，不关心定时器事件）。这会导致一定浪费。】
【这篇文章里没有讲到的一个重要概念是 watcher。观察者。】
【事实上，不是所有的事件都放置在一个队列里。】
【不同的事件，放置在不同的队列。】
【当我们没有使用定时器时，则完全不用关心定时器事件这个队列】
【当我们进行定时器调用时，首先会设置一个定时器 watcher。事件循环的过程中，会去调用该 watcher，检查它的事件队列上是否产生事件（比对时间的方式）】
【当我们进行磁盘 IO 的时候，则首先设置一个 io watcher，磁盘 IO 完成后，会在该 io watcher 的事件队列上添加一个事件。事件循环的过程中从该 watcher 上处理事件。处理完已有的事件后，处理下一个 watcher】
【检查完所有 watcher 后，进入下一轮检查】
【对某类事件不关心时，则没有相关 watcher】

【最后，如有问题，谢谢指出】
