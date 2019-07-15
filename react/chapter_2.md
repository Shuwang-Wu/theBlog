# 漫谈 React

## 2.1 合成事件系统

React 的合成事件系统只是原生 DOM 事件系统的一个子集，仅仅实现了 DOM Level 3 的事件接口，并且统一了浏览器间的兼容问题。有些事件 React 并没有实现，或者受某些限制没办法去实现，比如 window 的 resize 事件

### 合成事件的实现机制

在 React 底层, 主要对合成事件做了两件事：事件委派和自动绑定

1. 事件委派
   不会把处理函数直接绑定到真是的节点上, 而是把所有事件绑定到结构的最外层，使用一个统一的事件监听器，这个事件监听器维持了一个映射来保存所有组件内部的事件监听和处理函数。当组件挂载或者卸载的时候，只是在这个统一的事件监听器上插入或删除一些对象，当时事件发生时，首先被这个统一的事件监听器处理，然后在映射里找到真正的事件处理函数并调用
2. 自动绑定
   自动绑定 this 为当前组件;对这种引用进行缓存，以达到 CPU 和内存的最优化;在使用 ES6class 或者纯函数的时候这种绑定就不存在了，需要我们手动绑定 this
   - bind 绑定
   - 构造器内声明
   - 箭头函数

### 在 React 中使用原生事件

- 在组件已经完成安装并且存在真实 DOM 调用后，可以完成原生事件的绑定
- 在 React 中使用 DOM 原生事件时，一定要在组件卸载时手动移除，否则可能出现内存泄漏的问题
- 用 reactEvent.nativeEvent.
  stopPropagation() 来阻止冒泡是不行的。阻止 React 事件冒泡的行为只能用于 React 合成事件系统
  中，且没办法阻止原生事件的冒泡。反之，在原生事件中的阻止冒泡行为，却可以阻止 React 合成
  事件的传播

### 对比 React 合成事件与 JavaScript 原生事件

1. 事件传播与阻止事件传播
   React 的合成事件则并没有实现事件捕获，仅仅支持了事件冒泡机制。这种 API 设计方式统一而简洁，符合“二八原则”
2. 事件类型
   React 合成事件的事件类型是 JavaScript 原生事件类型的一个子集
3. 事件绑定方式
   - 直接在 DOM 元素中绑定
   - 在 JavaScript 中，通过为元素的事件属性赋值的方式实现绑定
   - 通过事件监听函数来实现绑定
4. 事件对象

## 2.2 表单

### 受控组件

每当表单的状态发生变化时，都会被写入到组件的 state 中，这种组件在 React 中被称为受控组件（controlled component）
总结下 React 受控组件更新 state 的流程：
(1) 可以通过在初始 state 中设置表单的默认值
(2) 每当表单的值发生变化时，调用 onChange 事件处理器
(3) 事件处理器通过合成事件对象 e 拿到改变后的状态，并更新应用的 state
(4) setState 触发视图的重新渲染，完成表单组件值的更新

### 对比受控与非受控组件

1. 性能上的问题
   在受控组件中，每次表单的值发生变化时，都会调用一次 onChange 事件处理器，这确实会
   有一些性能上的损耗
2. 是否需要事件绑定
   使用受控组件最令人头疼的就是，我们需要为每个组件绑定一个 change 事件，并且定义一
   个事件处理器来同步表单值和组件的状态，这是一个必要条件。

### 表单组件的几个重要属性

1. 状态属性
   value checked selected
2. 事件属性

## 2.3 样式处理

### 2.3.1 基本样式设置

 自定义组件建议支持 className prop，以让用户使用时添加自定义样式；
 设置行内样式时要使用对象。

1. 样式中的像素值
   React 会自动对这样的属性添加 px
   注意，有些属性除了支持 px 为单位的像素值，还支持数字直接作为值，此时 React 并不添加 px，如 lineHeight①
2. 使用 classnames 库

### 2.3.2 CSS Modules

CSS 模块化重要的是解决好以下两个问题：CSS 样式的导入与导出

## 2.4 组件间的通信

1. 父组件向子组件通信
2. 子组件向父组件通信
3. 跨级组件通信
4. 没有嵌套关系的组件通信

## 2.5 组件件抽象

### 2.5.1 mixin

将一个模块混入到一个另一个模块中，或是一个 类中

1. 使用 mixin 的缘由
   事实上，包括 C++ 等一些年龄较大的 OOP 语言，
   它们都有一个强大但危险的多重继承特性。现代语言为了权衡利弊，大都舍弃了多重继承，只采
   用单继承，但单继承在实现抽象时有诸多不便之处。为了弥补缺失，Java 引入了接口（interface），
   其他一些语言则引入了像 mixin 的技巧，方法虽然不同，但都是为创造一种类似多重继承的效果，
   事实上说它是组合更为贴切
2. 封装 mixin 方法
3. 在 React 中使用 mixin
   - 工具方法
   - 生命周期继承
4. ES6 Classes 与 decorator
5. mixin 的问题
   - 破坏了原有组件的封装
   - 命名冲突
   - 增加复杂性

### 2.5.2 高阶组件

higher-order function（高阶函数）在函数式编程中是一个基本的概念，它描述的是这样一种函数：这种函数接受函数作为输入，或是输出一个函数
高阶组件（higher-order component），类似于高阶函数，它接受 React 组件作为输入，输出一个新的 React 组件
用通俗的语言解释就是，当 React 组件被包裹时（wrapped），高阶组件会返回一个增强
（enhanced）的 React 组件。可以想象，高阶组件让我们的代码更具有复用性、逻辑性与抽象特性。
它可以对 render 方法作劫持，也可以控制 props 与 state。
实现高阶组件的方法有如下两种:

1.  属性代理
    堆栈调用: didmount→HOC didmount→(HOCs didmount)→(HOCs will unmount)→HOC will unmount→unmount
    - 控制 props
    - 通过 refs 使用引用
    - 抽象 state
    - 使用其他元素包裹 WrappedComponent
2.  反向继承
3.  组件命名
4.  组件参数

### 2.5.3 组合式组件开发实践

1. 组件再分离

## 2.6 组件性能优化

### 2.6.1 纯函数

纯函数由三大原则构成：

- 给定相同的输入，它总是返回相同的输出
- 过程没有副作用（side effect）
- 没有额外的状态依赖

React 在设计时带有函数式编程的基因，因为 React 组件本身就是纯函数。React 的
createElement 方法保证了组件是纯净的，即传入指定 props 得到一定的 Virtual DOM，整个过程
都是可预测的

### 2.6.2 PureRender

1. PureRender 本质
   怎么实现 PureRender 的过程呢？官方在早期就为开发者提供了名为 react-addons-pure-rendermixin 的插件。其原理为重新实现了 shouldComponentUpdate 生命周期方法，让当前传入的 props
   和 state 与之前的作浅比较，如果返回 false，那么组件就不会执行 render 方法

```js
// React浅比较
function shallowEqual(obj, newObj) {
  if (obj === newObj) return true
  const objKeys = Object.keys(obj)
  const newObjKeys = Object.keys(newObj)
  if (objKeys.length !== newObjKeys) {
    return false
  }
  return newObjKeys.every(key => newObjKeys[key] === obj[key])
}
```

2. 运用 PureRender
3. 优化 PureRender

- 直接为 props 设置对象或数组
  我们知道，每次调用 React 组件其实都会重新创建组件。就算传入的数组或对象的值没有改
  变，它们引用的地址也会发生改变
  Immutable.js
- 设置 props 方法并通过事件绑定在元素上

- 设置子组件

### 2.6.3 Immutable

1. Immutable 实现的原理:
   是持久化的数据结构（persistent data structure），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免深拷贝把所有节点都复制一遍带来的性能损耗，Immutable 使用了结构共享（structural sharing），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其他节点则进行共享;
   Immutable Data 就是一旦创建，就不能再更改的数据;
   对 Immutable 对象进行修改、添加或删除操作，都会返回一个新的 Immutable 对象;
2. Immutable 的优点

- 降低了“可变”带来的复杂度
- 节省内存
- 撤销/重做，复制/粘贴，甚至时间旅行这些功能做起来都是小菜一碟。
  因为每次数据都是不一样的，那么只要把这些数据放到一个数组里存储起来，想回退到哪里，就拿出对应
  的数据，这很容易开发出撤销及重做这两种功能
- 并发安全
- 拥抱函数式编程

3. 使用 Immutable 的缺点
   - 容易与原生对象混淆是使用 Immutable 的过程中遇到的最大的问题。
   - Immutable 中的 Map 和 List 虽然对应的是 JavaScript 的 Object 和 Array，但操作完全不同，
     比如取值时要用 map.get('key') 而不是 map.key，要用 array.get(0) 而不是 array[0]
   - Immutable 每次修改都会返回新对象，很容易忘记赋值
   - 避免上述问题的发生:
     使用 FlowType 或 TypeScript 静态类型检查工具；
     约定变量命名规则，如所有 Immutable 类型对象以 \$\$ 开头；
     使用 Immutable.fromJS 而不是 Immutable.Map 或 Immutable.List 来创建对象，这样可以避免 Immutable 对象和原生对象间的混用
4. Immutable.is
5. Immutable 与 cursor
6. Immutable 与 PureRender

### 2.6.4 key

## 2.7 动画

###2.7.1 CSS 动画与 JavaScript 动画

1. CSS 动画的局限性

- CSS 只支持 cubic-bezier 的缓动，如果你的动画对缓动函数有要求，就必须使用 JavaScript
  动画
- CSS 动画只能针对一些特有的 CSS 属性。仍然有一些属性是 CSS 动画不支持的，例如
  SVG 中 path 的 d 属性
- CSS 把 translate、rotate、skew 等都归结为一个属性——transform。因此，这些属性只
  能共用同一个缓动函数。例如，我们想要动画的轨迹是一条贝塞尔曲线，可以通过给 left
  和 top 这两个属性加两个不同的 cubic-bezier 缓动来实现，但是 left 和 top 实现的动画性
  能不如 translateX 和 translateY

2. CSS animation
3. 用 JavaScript 包装过的 CSS 动画
4. JavaScript 动画
5. SVG 线条动画

### 2.7.2 玩转 React Transition

1. React Transition 的设计及用法
   React Transition 生命周期
    componentWillAppear
    componentDidAppear
    componentWillEnter
    componentDidEnter
    componentWillLeave
    componentDidLeave

### 2.7.3 缓动函数

1. 缓动函数用户体验
2. 物理缓动

## 2.8 自动化测试

### 2.8.1 Jest

Jest 是由 Facebook 开源的 React 单元测试框架，内部 DOM 操作基于 JSDOM，语法和断言
基于 Jasmine 框架。它有以下 4 个特点
 自动找到测试；
 自动 mock 模拟依赖包，达到单元测试的目的；
 并不需要真实 DOM 环境执行，而是 JSDOM 模拟的 DOM；
 多进程并行执行测试

1. Jest 实例
2. 浅渲染机制
   浅渲染（shallow rendering）很有趣，意思就是只渲染组件中的第一层，这样测试执行器就
   不需要关心 DOM 和执行环境了
3. 全渲染机制
   全渲染（full rendering）就是完整渲染出当前组件及其所有的子组件，就像在真实浏览器中
   渲染那样。当组件内部直接改变了 DOM 时，就需要使用全渲染来测试。全渲染需要真实地模拟
   DOM 环境，流行的做法有以下几种

   - 使用 JSDOM
   - 使用 Cheerio
   - 使用 Karma

### 2.8.2 Enzyme

Enzyme 提供 3 种不同的方式来测试组件
 shallow：推荐的方式，浅渲染，只会渲染本组件内容，引用的外部组件不会渲染，提供
更多好的隔离性。
 render：如果 shallow 不能满足，才会使用它。基于 Cheerio 来模拟 DOM 环境（Cheerio 是
类似 JSDOM 的另一框架）。
 mount：类似 render，会做全渲染，对于测试生命周期时非常有用。

### 2.8.3 自动化测试
