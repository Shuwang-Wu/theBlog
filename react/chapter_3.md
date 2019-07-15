# 解读 React 源码

## 初探 React 源码

源码的组织架构

- src

  - renderers：是 React 代码的核心部分，它包含了大部分功能实现，此处对其进行单独分析

  - dom

    - client
      包含 DOM 操作方法（如 findDOMNode、setInnerHTML、setTextContent 等）以及事件方法，结构如图 3-2 所示。这里的事件方法主要是一些非底层的实用性事件方法，如事件监听（ReactEventListener）、常用事件方法（TapEventPlugin、EnterLeaveEventPlugin）以及一些合成事件（SyntheticEvents 等）
    - server
      主要包含服务端渲染的实现和方法（如 ReactServerRendering、ReactServerRenderingTransaction 等）
    - shared
      包含文本组件（ReactDOMTextComponent）、标签组件（ReactDOMComponent）、DOM 属性操作（DOMProperty、DOMPropertyOperations）、CSS 属性操作（CSSProperty、CSSPropertyOperations）等

  - shared

    - event
      包含一些更为底层的事件方法，如事件插件中心（EventPluginHub）、事件注册（EventPluginRegistry）、事件传播（EventPropagators）以及一些事件通用方法
    - reconciler
      称为协调器，它是最为核心的部分，包含 React 中自定义组件的实现（ReactCompositeComponent）、组件生命周期机制、setState 机制（ReactUpdates、ReactUpdateQueue）、DOM diff 算法（ReactMultiChild）等重要的特性方法

  - shared：包含一些公用或常用方法，如 Transaction、CallbackQueue 等
  - addons：包含一系列的工具方法插件，如 PureRenderMixin、CSSTransitionGroup、Fragment、LinkedStateMixin 等
  - core/tests：包含一些边界错误的测试用例。
  - test：包含一些测试方法等
  - isomorphic：包含一系列同构方法。

    - children
    - classic
    - deprecated
    - moderm

## Virtual DOM 模型

其实，构建一套简易 Virtual DOM 模型并不复杂，它只需要具备一个 DOM 标签所需的基本
元素即可：

- 标签名
- 节点属性，包含样式、属性、事件等
- 子节点
- 标识 id

```js
{
 // 标签名
 tagName: 'div',
 // 属性
 properties: {
 // 样式
 style: {}
 },
 // 子节点
 children: [],
 // 唯一标识
 key: 1
}
```

Virtual DOM 中的节点称为 ReactNode,它分为 3 种类型 ReactElement、ReactFragment 和 ReactText;
其中，ReactElement 又分为 ReactComponentElement 和 ReactDOMElement。

### DOM 标签组件

对于原生 DOM 而
言，Virtual DOM 就如同一个隔离的沙盒，因此 React 的处理并不是直接操作和污染原生 DOM，
这样不仅保持了性能上的高效和稳定，而且降低了直接操作原生 DOM 而导致错误的风险
ReactDOMComponent 针对 Virtual DOM 标签的处理主要分为以下两个部分：
 属性的更新，包括更新样式、更新属性、处理事件等；
 子节点的更新，包括更新内容、更新子节点，此部分涉及 diff 算法。

1. 更新属性
   当执行 mountComponent 时，ReactDOMComponent 首先会生成标记和标签,通过 this.createOpenTagMarkupAndPutListener(transaction)来处理 DOM 节点:
   删除不需要的旧属性-->更新新属性-->
2. 更新子节点

- ReactDOMComponent
  - mountComponent --> \_createOpenTagMarkupAndPutListener --> \_createContentMarkup
  - receiveComponent
  - updateComponent --> updateComponent --> \_updateDOMProperties --> \_updateDOMChildren

### 自定义组件

ReactCompositeComponent 自定义组件实现了一整套 React 生命周期和 setState 机制，因此自
定义组件是在生命周期的环境中进行更新属性、内容和子节点的操作。这些更新操作与
ReactDOMComponent 的操作类似

- ReactCompositeComponent
  - mountComponent
  - unmountComponent
  - receiveComponent
  - updateComponent
  - construct
  - createClass
  - performInitialMount
  - performUpdateIfNecessary
  - \_updateRenderedComponent
  - \_processPendingState

## 生命周期的管理艺术

React 主要思想是通过构建可复用组件来构建用户界面
所谓组件，就是有限状态机，通过状态渲染对应的界面，且每个组件都有自己的生命周期，它规定了组件的状态和方法需要在那个阶段改变和执行
有限状态机，表示有限个状态以及在这些状态之间的转义和动作等行为的模型
一般通过状态、事件、转换、和动作来描述有限状态机

### 初探生命周期

1. 当首次挂载组件时，按顺序执行：
   1)getDefaultProps
   2)getInitialState
   3)componentWillMount
   4)render
   5)componentDidMount
2. 卸载组件时：componentWillUnmount
3. 当重新挂载组件时，按顺序执行：
   1)getInitialState
   2)componentWillMount
   3)render
   4)componentDidMount
4. 当再次渲染组件时，组件接收到更新状态，此时按顺序执行
   1)componentWillReceiveProps
   2)shouldComponentUpdate
   3)componentWillUpdate
   4)render
   5)componentDidUpdate
   ES6 static defaultProps === getDefaultProps, constructor === getInitialState

### 详解 React 生命周期

1. MOUNTING
2. RECEIVE_PROPS
3. UNMOUNTING

### 使用 createClass 创建自定义组件

createClass 是创建自定义组件的入口方法，负责管理生命周期中的 getDefaultProps

1. 通过 mountComponent 挂载组件，初始化序号、标记等参数，判断是否为无状态组件，并进行对应的组件初始化工作，比如初始化 props,context 等参数
2. 若存在 componentWillMount,则执行
   如果此时在 componentWillMount 中调用 setState 方法，是不会触发 re-render,而是会进行 state 合并, 且 inst.state = this.\_processPendingState(inst.props, inst.context)是在 componentWillMount 之后执行的，因此 componentWillMount 中的 this.state 并不是最新的，在 render 中才可以获取更新之后的状态
   因此，React 是利用更新队列 this.\_pendingStateQueue 以及更新状态 this.\_pendingReplaceState 和 this.\_pendingForceUpdate 来实现 setState 的异步更新机制
3. 若更新完成之后，存在 componentDidMount 则调用

其实，mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在子组件之前调用，父组件的 componentDidMount 是在子组件之后调用
