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
   mountComponent 负责管理生命周期中的 getInitialState、componentWillMount、render 和
   componentDidMount
2. RECEIVE_PROPS
   updateComponent 负责管理生命周期中的 componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、render 和 componentDidUpdate
3. UNMOUNTING

### 使用 createClass 创建自定义组件

createClass 是创建自定义组件的入口方法，负责管理生命周期中的 getDefaultProps

1. 通过 mountComponent 挂载组件，初始化序号、标记等参数，判断是否为无状态组件，并进行对应的组件初始化工作，比如初始化 props,context 等参数
2. 若存在 componentWillMount,则执行
   如果此时在 componentWillMount 中调用 setState 方法，是不会触发 re-render,而是会进行 state 合并, 且 inst.state = this.\_processPendingState(inst.props, inst.context)是在 componentWillMount 之后执行的，因此 componentWillMount 中的 this.state 并不是最新的，在 render 中才可以获取更新之后的状态
   因此，React 是利用更新队列 this.\_pendingStateQueue 以及更新状态 this.\_pendingReplaceState 和 this.\_pendingForceUpdate 来实现 setState 的异步更新机制
3. 若更新完成之后，存在 componentDidMount 则调用

其实，mountComponent 本质上是通过递归渲染内容的，由于递归的特性，父组件的 componentWillMount 在子组件之前调用，父组件的 componentDidMount 是在子组件之后调用

### 无状态组件

### 详解生命周期

mounting:
getDefaultProps -> getInitialState -> componentWillMount -> render -> componentDidMount
receive props:
componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
unmount:
componentWillUnmount

### 解密 setState 机制

state 是 React 中重要的概念
setState 通过一个队列机制实现 state 更新
React 也正是利用状态队列机制实现了 setState 的异步更新，避免频繁地重复更新 state

### 初始事务

事务就是将需要执行的方法使用 wrapper 封装起来，再通过事务提供的 perform 方法执行

## diff 算法

1. diff 策略
    策略一：Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。
    策略二：拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会
   生成不同的树形结构。
    策略三：对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。
   基于以上策略，React 分别对 tree diff、component diff 以及 element diff 进行算法优化

2. tree diff
   Q:如果存在一个 R 节点，下面有 ab 两个节点，然后 a 下面存在 cd 两个节点，将 a 移动到 b 节点时，会发生什么操作？
   A:因为 react 不会跨层级来对节点进行比较，当发生上述的操作时，react 会进行以下操作 createA -> createc -> createD -> deleteA（即创建一个暂新的 A 节点，然后设置为 B 节点的子节点，然后删除原来的 A 节点）
   \*\* 在开发组件时，保持稳定的 DOM 结构会有助于性能的提升。例如，可以通过 CSS 隐藏或显示节点，而不是真正地移除或添加 DOM 节点。

3. component diff
   React 是基于组件构建应用的，对于组件间的比较所采取的策略也是非常简洁、高效的。
    如果是同一类型的组件，按照原策略继续比较 Virtual DOM 树即可。
    如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。
    对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切知道这点，那
   么就可以节省大量的 diff 运算时间。因此，React 允许用户通过 shouldComponentUpdate()
   来判断该组件是否需要进行 diff 算法分析。

4. element diff
   当节点处于同一层级时，diff 提供了 3 种节点操作，分别为 INSERT*MARKUP（插入）、MOVE*
   EXISTING（移动）和 REMOVE_NODE（删除）
    INSERT_MARKUP：新的组件类型不在旧集合里，即全新的节点，需要对新节点执行插入操作。
    MOVE_EXISTING：旧集合中有新组件类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操
   作，可以复用以前的 DOM 节点。
    REMOVE_NODE：旧组件类型，在新集合里也有，但对应的 element 不同则不能直接复用和更
   新，需要执行删除操作，或者旧组件不在新集合里的，也需要执行删除操作

## React Patch 方法

React Patch 实现了关键的最后一步。所谓 Patch，简而言之就是将 tree diff 计算出来的 DOM
差异队列更新到真实的 DOM 节点上，最终让浏览器能够渲染出更新的数据
主要是通过遍历差异队列实现的。遍历差异队列时，通过更新类型进行相应的操作，包括：新节点的插入、已有节点的移动和移除等
这里为什么可以直接依次插入节点呢？原因就是在 diff 阶段添加差异节点到差异队列时，本
身就是有序添加。也就是说，新增节点（包括 move 和 insert）在队列里的顺序就是最终真实 DOM
的顺序，因此可以直接依次根据 index 去插入节点。而且，React 并不是计算出一个差异就去执
行一次 Patch，而是计算出全部差异并放入差异队列后，再一次性地去执行 Patch 方法完成真实
DOM 的更新

1. dispatcher 与 action
   register 方法用来注册一个监听器，而 dispatch 方法用来分发一个 action。
   action 是一个普通的 JavaScript 对象，一般包含 type、payload 等字段，用于描述一个事件以及需要改变的相关数据
2. store
   store 负责保存数据，并定义修改数据的逻辑，同时调用 dispatcher 的 register 方
   法将自己注册为一个监听器
3. controller-view
4. view
5. actionCreator

## Flux 应用实例

```js
   ├── css
   │  └── app.css
   └── js
      ├── actions/
      ├── components/
      ├── constants/
      ├── dispatcher/
      ├── stores/
      └── app.js
```

## Redux

### Redux 简介

1. Redux 是什么
   “Redux”本身指 redux 这个 npm 包，它提供若干 API 让我们使用 reducer 创建 store，并能够
   更新 store 中的数据或获取 store 中最新的状态。而“Redux 应用”则是指使用了 redux 这个 npm 包
   并结合了视图层实现（如 React）及其他前端应用必备组件（路由库、Ajax 请求库）组成的完整
   的类 Flux 思想的前端应用
2. Redux 三大原则
   - 1. 单一数据源
        在 Redux 的思想里，一个应用永远只有唯一的数据源
   - 2. 状态是只读的
   - 3. 状态修改均由纯函数完成
3. Redux 核心 API
   最核心的 API——createStore：通过 createStore 方法创建的 store 是一个对象，它本身又包含 4 个方法
   - getState()：获取 store 中当前的状态
   - dispatch(action)：分发一个 action，并返回这个 action，这是唯一能改变 store 中数据的方式
   - subscribe(listener)：注册一个监听者，它在 store 发生变化时被调用
   - replaceReducer(nextReducer)：更新当前 store 里的 reducer，一般只会在开发模式中调用该方法
4. 与 React 绑定
   - Redux 的核心只有一个 createStore() 方法，但是仅仅使用这个方法还不足以让 Redux 在我们的 React 应用中发挥作用。我们还需要 react-redux 库——Redux 官方提供的 React 绑定
   - react-redux 提供了一个组件和一个 API 帮助 Redux 和 React 进行绑定，一个是 React 组件<Provider/> ，一个是 connect()
     <Provider/> 接受一个 store 作为 props，它是整个 Redux 应用的顶层组件
     connect() 提供了在整个 React 应用的任意组件中获取 store 中数据的功能
5. 增强 Flux 的功能

### Redux middleware

1. middleware 的由来
2. 理解 middleware 机制
   - 函数式编程思想设计
     currying 的 middleware 结构的好处主要有以下两点：
     - 易串联：currying 函数具有延迟执行的特性，通过不断 currying 形成的 middleware 可以累积参数，再配合组合（compose）的方式，很容易形成 pipeline 来处理数据流
     - 共享 store：在 applyMiddleware 执行的过程中，store 还是旧的，但是因为闭包的存在，
       applyMiddleware 完成后，所有的 middleware 内部拿到的 store 是最新且相同的
   - 给 middleware 分发 store
     middlewareAPI 中的 dispatch 为什么要用匿名函数包裹呢？
     我们用 applyMiddleware 是为了改造 dispatch，所以 applyMiddleware 执行完后，dispatch 是
     变化了的，而 middlewareAPI 是 applyMiddleware 执行中分发到各个 middleware 的，所以
     必须用匿名函数包裹 dispatch，这样只要 dispatch 更新了，middlewareAPI 中的 dispatch 应
     用也会发生变化
   - 组合串联 middleware
3. Redux 异步流
   - 1. redux-thunk
        Thunk 函数实现上就是针对多参数的 currying 以实现对函数的惰性求值
        ```js
        <!-- react-thunk 源码 -->
        function createThunkMiddleware(extraArgument){
          return ({dispatch, getState}) => next => action => {
            if (typeof action==='function') {
              return action(dispatch,getState,extraArgument)
            }
            return next(action)
          }
        }
        ```
   - 2. redux-promise
   ```js
   <!-- redux-promise middleware -->
   import {isFSA} from 'flux-standard-action'
   function isPromise(val) {
     return val && typeof val.then === 'function'
   }
   export default function promiseMiddleware({dispatch}) {
     return next => action => {
       if (!isFSA(action)) {
         return isPromise(action) ? action.then(dispatch) : next(action)
       }
     }
     return isPromise(action.payload) ? action.payload.then(
       result => dispath({...action,payload: result}),
       error => {
         dispatch({...action, payload: error, error:true})
         return Promise.reject(error)
       }
    ) : next(action)
   }
   ```
   - 3. [redux-composable-fetch](./fetchMiddleware.js)

### 使用 middleware 处理复杂异步流

在实际场景中，我们不但有短连接请求，还有轮询请求，多异步串联请求，或是在异步中加入同步处理的逻辑

1. 轮询
   轮询是长连接的一种实现方式，它能够在一定时间内重新启动自身，然后再发起请求,
   可以在[redux-composable-fetch](./fetchMiddleware.js)的基础上再写一个 middleware
   [redux-polling](./redux_polling.js)
2. 多异步串联
   ```js
   const sequenceMiddleware = ({ dispatch, getState }) => action => {
     if (!Array.isArray(action)) {
       return next(action)
     }
     return action.reduce((result, currAction) => {
       return result.then(() => {
         return Array.isArray(currAction?Promise.all(currAction.map=>dispatch(item))) : dispatch(currAction)
       })
     }, Promise.resolve())
   }
   ```
3. redux-saga
   在 Redux 社区，还有一个处理异步流的后起之秀，名为 redux-saga。它与上述方法最直观的
   不同就是用 generator 替代了 promise，我们通过 Babel 可以很方便地支持 generator
   ```js
   function* getCurrCity(ip) {
     const data = yield call('/api/getCurrCity.json', { ip });
     yield put({
       type: 'GET_CITY_SUCCESS',
       payload: data,
     });
   }
   function* getWeather(cityId) {
     const data = yield call('/api/getWeatherInfo.json', { cityId });
     yield put({
       type: 'GET_WEATHER_SUCCESS',
       payload: data,
     });
   }
   function loadInitData(ip) {
     yield getCurrCity(ip);
     yield getWeather(getCityIdWithState(state));
     yield put({
       type: 'GET_DATA_SUCCESS',
     });
   }
   ```

## Redux 与路由

在 Redux 应用中，我们遇到了一些新的问题。其中最迫切的问题是，应用程序的所有状态都应该保存在一个单一的 store 中，而当前的路由状态很明显也属于应用状态的一部分。如果直接使用 React Router，就意味着所有路由相关的信息脱离了 Redux store 的控制，这样就违背了
Redux 的设计思想，也给我们的应用带来了更多的不确定性。

### React Router

1. React Router

1) 路由的基本原理
   简单的来说，路由的基本原理即是保证 View 和 URL 同步，而 View 可以看做是资源的一种体现
2) React Router 的特性
   - 声明式路由
     能够让我们对整个应用的路由设计有一个全面的理解
   - 嵌套路由及路径匹配
   - 支持多种路由切换方式
     路由切换无外乎使用 hashChange 或是 history.pushState。
     hashChange 的方式拥有良好的浏览器兼容性，但是 url 中却多了丑陋的 /#/ 部分；
     而 history.pushState 方法则能给我们提供优雅的 url，却需要额外的服务端配置解决任意路径刷新的问题

2. React Router Redux
   它的职责主要是将应用的路由信息与 Redux 中的 store 绑定在一起。
   因为对于前端应用来说，路由状态（当前切换到了哪个页面，当前页面的参数有哪些，等等）也是应用状态的一部分

1) 将 React Router 与 Redux store 绑定

### Redux 与组件

1. 容器型组件
   容器型组件，意为组件是怎么工作的，更具体一些就是数据是怎么更新的；
   它不会包含任何 Virtual DOM 的修改或组合，也不会包含组件的样式
2. 展示型组件
   展示型组件，意为组件是怎么渲染的
   它包含了 Virtual DOM 的修改或组合，也可能包含组件的样式。同时，它不依赖任何形式的 store
3. Redux 中的组件

1) Layouts
2) Views
3) Components

### Redux 应用实例

## Redux 高阶运用

### 高阶 redux

1. reducer 的复用

```js
function generateReducer(prefix, state) {
  const LOAD_DATA = prefix + 'LOAD_DATA'
  const presetState
  const initialState = { ...presetState, ...state }
  return function reducer(state = initialState, action) {
    switch (action.type) {
      case LOAD_DATA:
        return {
        ...state,
        data: action.payload,
        };
      default:
        return state;
    }
  }
}
```

2. reducer 的增强
   高阶组件主要通过下面 3 点来增强 reducer:
   1. 能够处理额外的 action
   2. 能够维护更多的 state
   3. 将不能处理的 action 委托给原始 reducer 处理

### Redux 与表单

具体到 react 中, 单向绑定意味着你需要手动给每一个表单控件提供 onChange 回调函数，同时需要将他们的状态初始化在 this.state 中

1. 使用 redux-form-utils 减少创建表单的冗余代码
2. 使用 redux-form 完成表单的异步验证
3. 使用高阶 reducer 为现有模块引入表单验证功能

### Redux CRUD 实战

### Redux 性能优化

事实上，对于 Redux 来说，每当 store 发生改变时，所有的 connect 都会重新计算。在一个
大型应用中，浪费的重复计算可想而知。为了减少性能浪费，我们想到对 connect 中的这些 selector
函数做缓存

1. Reselect
2. Immutable Redux
3. Redux 性能优化
   1. logSlowReducers
   2. specialActions
   3. batchActions

### 解读 Redux

1. 参数归一化

2. 初始状态及 getState

```js
var currentReducer = reducer
var currentState = initialState
var listeners = []
var isDispatching = false
/**
 * Reads the state tree managed by the store.
 *
 * @returns {any} The current state tree of your application.
 */

function getState() {
  return currentState
}
```

从上面的代码中可以看到，我们定义了 4 个本地变量。
 currentReducer：当前的 reducer，支持通过 store.replaceReducer 方式动态替换 reducer，
为代码热替换提供了可能。
 currentState：应用的当前状态，默认为初始化时的状态。
 listeners：当前监听 store 变化的监听器。
 isDispatching：某个 action 是否处于分发的处理过程中。
而 getState 方法用于返回当前状态

3. subscribe
   在 getState 之后，我们定义了 store 的另一个方法 subscribe：
   ```js
   function subscribe(listener) {
     listeners.push(listener)
     var isSubscribed = true
     return function unsubscribe() {
       if (!isSubscribed) {
         return
       }
       isSubscribed = false
       var index = listeners.indexOf(listener)
       listeners.splice(index, 1)
     }
   }
   ```
   你可能会感到奇怪，好像我们在 Redux 应用中并没有使用 store.subscribe 方法？事实上，
   React Redux 中的 connect 方法隐式地帮我们完成了这个工作
4. dispatch
   接下来，要说到的就是 store 非常核心的一个方法，也是我们在应用中经常直接
   （store.dispatch({ type: 'SOME_ACTION' })）或间接（使用 connect 将 action creator 与 dispatch 关联）使用的方法——dispatch：

   ```js
   function dispatch(action) {
     if (!isPlainObject(action)) {
       throw new Error(
         'Actions must be plain objects. ' +
           'Use custom middleware for async actions.'
       )
     }
     if (typeof action.type === 'undefined') {
       throw new Error(
         'Actions may not have an undefined "type" property. ' +
           'Have you misspelled a constant?'
       )
     }
     if (isDispatching) {
       throw new Error('Reducers may not dispatch actions.')
     }
     try {
       isDispatching = true
       currentState = currentReducer(currentState, action)
     } finally {
       isDispatching = false
     }
     listeners.slice().forEach(listener => listener())
     return action
   }
   ```

5. replaceReducer
   这个方法主要用于 reducer 的热替换，在开发过程中我们一般不会直接使用这个 API：
   ```js
   function replaceReducer(nextReducer) {
     currentReducer = nextReducer
     dispatch({ type: ActionTypes.INIT })
   }
   ```
6. 解读 react-redux  
   提供了 React 与 Redux 之间的绑定
   1. Provider
      <!-- 下面是部分源码 -->
   ```js
   export default class Provider extends Component {
     getChildContext() {
       return { store: this.store }
     }
     constructor(props, context) {
       super(props, context)
       this.store = props.store
     }
     render() {
       const { children } = this.props
       return Children.only(children)
     }
   }
   if (process.env.NODE_ENV !== 'production') {
     Provider.prototype.componentWillReceiveProps = function(nextProps) {
       const { store } = this
       const { store: nextStore } = nextProps
       if (store !== nextStore) {
         warnAboutReceivingStore()
       }
     }
   }
   ```
7. connect

```js
import hoistStatic from 'hoist-non-react-static'

export default function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options = {}
) {
  return function wrapWithConnect(WrappedComponent) {
    const shouldSubcribe = Boolean(mapStateToProps)
    class Connect extends Component {
      trySubscribe() {
        if (shouldSubcribe && !this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
          this.handleChange()
        }
      }
      // ...
      render() {
        // ...
        if (withRef) {
          this.renderedElement = createElement(WrappedComponent, {
            ...this.mergedProps,
            ref: 'wrappedInstance'
          })
        } else {
          this.renderedElement = createElement(
            WrappedComponent,
            this.mergedProps
          )
        }
        return this.renderedElement
      }
    }
    // ...
    return hoistStatic(Connect, WrappedComponent)
  }
}
```

- mapStateToProps
- mapDispatchToProps
- mergeProps
  也是一个函数，接受 stateProps、dispatchProps 和 ownProps 作为参数
  - stateProps 就是我们传给 connect 的第一个参数 mapStateToProps 最终返回的 props
  - dispatchProps 是第二个参数的最终产物
  - ownProps 则是组件自己的 props
- options
  - pure
    布尔值，默认为 true。当该配置为 true 时，Connect 中会定义 shouldComponentUpdate
    方法并使用浅对比判断前后两次 props 是否发生了变化，以此来减少不必要的刷新。如果
    应用严格按照 Redux 的方式进行架构，该配置保持默认即可。
  - withRef
    布尔值，默认为 false。如果设置为 true，在装饰传入的 React 组件时，Connect
    会保存一个对该组件的 refs 引用，你可以通过 getWrappedInstance 方法来获得该 refs，
    并最终获得原始的 DOM 节点

### 代码热替换

```js
// 帮助追踪热重载
let nextVersion = 0
export default function connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options = {}
) {
  // ...
  // 帮助追踪热重载
  const version = nextVersion++
  return function wrapWithConnect(WrappedComponent) {
    // ...
    class Connect extends Component {
      constructor(props, context) {
        // ...
        this.version = version
      }
    }
  }
}
```

### 小结

## React 服务端渲染

### React 与服务端模板

React 之所以能做到服务端渲染主要是因为 ReactDOM，ReactDOM 中，还有一个分支 react-dom/server，它可以让 React 组件以字符串的形式渲染

- renderToString
  它把 React 元素转成一个 HTML 字符串并在服务端标识 reactid。所以在浏览器端再次渲染时，React 只是做事件绑定等前端相关的操作，而不会重新渲染整个 DOM 树，这样能带来高性能的页面首次加载。“同构”黑魔法主要就是从这个 API 而来的
- renderToStaticMarkup

1. 什么是服务端渲染
   服务端渲染，意味着前端代码可以在服务端作渲染，进而达到在同步请求 HTML 时，直接返回渲染好的页面
   - 利于 SEO
     服务端渲染可以让搜索引擎更容易读取页面的 meta 信息以及其他 SEO 的相关信息，大大增加了网站在搜索引擎中的可见度
   - 加速首屏渲染
     客户端渲染的一个缺点是，当用户第一次进入站点时，因为此时浏览器中没有缓存，需要下载代码后在本地渲染，时间较长。而服务端渲染则是，用户在下载时已经是渲染好的页面了，其打开速度比本地渲染快
   - 服务端和客户端可以共享某些代码, 避免重复定义
2. react-view

   - 配置

   ```js
   var defaultOption = {
     doctype: '<!DOCTYPE html>',
     beautify: false,
     cache: precess.env.NODE_ENV === 'production',
     extname: 'jsx',
     writeResp: true,
     views: path.join(__dirname, 'views'),
     internals: false
   }
   ```

   - 渲染
     标准的渲染过程其实非常简单。对于 React 来说，就是读取目录下的文件，就像前端加载一
     样使用 require。最后，利用 ReactDOMServer 中的方法来渲染

     ```js
     var render = internals
       ? ReactDOMServer.renderToString
       : ReactDOMServer.renderToStaticMarkup
     // ...
     var markup = options.doctype || ''
     try {
       var component= require(filepath)
       // 转换ES6代码后，组件输出可能是形如{default: Component}的形式
       component = component,.default || component
       markup += render(React.createElement(component, locals))
     } catch {
       err.code = 'REACT'
       throw err
     }
     if (options.beautify) {
       // 注意: 它可能会弄错一些重要的空格，而且和生产环境有所不同
       markup = beautifyHTML(markup)
     }
     var writeResp = locals.writeResp === false? : (locals.writeResp || options.writeResp)
     if (writeResp) {
       this.type = 'html'
       this.body = markup
     }
     return markup
     ```

     1. 设置 doctype 的目的
     2. 渲染 react 组件
     3. 美化 HTML
     4. 绑定到上下文

   - cache

   ```js
   // 匹配模版文件路径以清除cache
   var match = createMatchFunction(options.views)
   // ...
   if (!options.cache) {
     cleanCache(match)
   }
   // cleanCache
   function cleanCache(match) {
     Object.keys(require.cache).forEach(function(module) {
       if (match(require.cache[module].filename)) {
         delete require.cache[module]
       }
     })
   }
   ```

   - Babel

3. react-view 源码渲染

### 服务端渲染

1. 玩转 nodejs
   react-server-koa-simple/
   ├── app
   │ ├── assets
   │ │ ├── build
   │ │ ├── src
   │ │ │ ├── img
   │ │ │ ├── js
   │ │ │ └── css
   │ │ ├── package.json
   │ │ └── webpack.config.js
   │ ├── middleware
   │ │ └── static.js（前端静态资源托管 middleware）
   │ ├── plugin
   │ │ └── reactview（reactview 插件）
   │ └── views
   │ ├── layout
   │ │ └── Default.js
   │ ├── Device.js
   │ └── Home.js
   ├── .babelrc
   ├── .gitgnore
   ├── app.js
   ├── package.json
   └── README.md
   ```js
   // React组件
   import ReactDOM from 'react-dom'
   import Content from './components/Content.js'
   const appEle = document.getElementById('demoApp')
   const microdata = JSON.parse(appEle.getAttribute('data-microdata'))
   const mydata = JSON.parse(appEle.getAttribute('data-mydata'))
   ReactDOM.render(<Content mydata={mydata} microdata={microdata} />, appEle)
   // koa
   const koa = require('koa')
   const koaRouter = require('koa-router')
   const path = require('path')
   const reactview = require('./app/plugin/reactview/app.js')
   const Static = require('./app/middleware/static.js')
   const App = () => {
     let app = koa()
     let router = koaRouter()
     // 初始化 /home 路由分派的 generator
     router.get('/home', function*() {
       // 执行 view 插件
       this.body = this.render('Home', {
         microdata: {
           domain: '//localhost:3000'
         },
         mydata: {
           nick: 'server render body'
         }
       })
     })
     app.use(router.routes()).use(router.allowedMethods())
     // 注入 reactview
     const viewpath = path.join(__dirname, 'app/views')
     app.config = {
       reactview: {
         viewpath: viewpath
       }
     }
     reactview(app)
     return app
   }
   const createApp = () => {
     const app = App()
     // http 服务端口监听
     app.listen(3000, () => {
       console.log('3000 is listening!')
     })
     return app
   }
   createApp()
   ```
2. react-router 和 koa-router 统一

```js
// 初始化device/:deviceID路由分派的generator
router.get('/device/:deviceID', function*() {
  const deviceID = this.params.deviceID
  this.body = this.render('Device', {
    isServer: true,
    microdata: microddata,
    mydata: {
      path: this.path,
      deviceID: deviceID
    }
  })
})

// render 方面的代码
render() {
  const {microdata, mydata, isServer} = this.props
  const deviceJs = `${microdata.styleDomain}/build/${microdata.styleVersion}/js/device.js`
  const scriptUrls = [deviceJs]

  return (
    <Default
      microdata = {microdata}
      scriptUrls = {scriptUrls}
      title = {"demo"}
    >
      <div
        id="demoApp"
        data-microdata = {JSON.stringify(microdata)}
        data-mydata = {JSON.stringify(mydata)}
      >
        <Iso
          microdata = {microdata}
          mydata = {mydata}
          isServer = {isServer}
        />
      </div>
    </Default>
  )
}
// 前端访问app入口的实现
const appEle = document.getElementById('demoApp')

function getServerData(key) {
  return JSON.parse(appEle.getAttribute(`data-${key}`))
}

// 从服务端埋点处<div id='demoApp'>获取microdata和mydata

```

3. 同构数据处理的探讨
   在服务端, react 是不会去执行 componentDidMount 方法, 因为 React 的 renderTransaction 分成两部分：ReactReconcileTransaction 和 ReactServerRenderingTransaction

## 玩转 React 可视化

### React 结合 Canvas 和 SVG

- React 中的 Canvas
- React 中的 SVG
  - Bezier 曲线
  - SVG 图标
  - 网站 logo

### React 与可视化组件

1. 包装已有的可视化组件
2. 使用 D3 绘制 UI 部分
   - D3 支持数据与节点绑定，当数据发生变化时，节点自动变化
   - D3 实现了一套 selector 机制，能够让开发者直接操作 dom 节点、svg 节点
3. 使用 React 绘制 UI 部分

### Recharts 组件化的原理

## 开发环境

主流的模块规范有两种：

- AMD

- CommonJS

- UMD(把上述两种规范统一的通用模块规范)

### 运行开发环境: Node.js

### sass

Sass 是 CSS 预处理器,CSS 预处理器是一种由 CSS 扩展而来的语言，用于为 CSS 增加一些编程的特性。而且因为编译过程前置，所以无需考虑浏览器的兼容性问题，例如可以在 css 中使用变量，简单的程序逻辑、函数等基本技巧，让 css 更加简洁、适应性更强、代码更直观

### webpack

webpack 的定义是模块打包，它的目的就是把所有依赖关系的各种文件打包成一系列的静态资源

- 支持所有主流的打包标准（CommonJs、AMD、UMD、Gloabals）
- 通过不同的 webpack loader，支持打包 css、scss、json、markdown 等格式的文件
- 有完善的缓存破坏、散列系统
- 内置热加载功能
- 有一系列优化方案和插件机制来满足各种需求，如代码切割

关于 webpack-dev-server：
这是一个机遇 express 的小型文件服务器，最基本的功能是启动 http 服务器并让我们使用 http 协议访问应用。不过，最强大的功能在于和 webpack 结合提供强大的热模块替换功能
