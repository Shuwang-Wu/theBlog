# react 开发

## 生命周期函数

### 初始化阶段：

1. getDefaultProps:获取实例的默认属性

2. getInitialState:获取每个实例的初始化状态

3. componentWillMount：组件即将被装载、渲染到页面上

4. render:组件在这里生成虚拟的 DOM 节点

5. componentDidMount:组件真正在被装载之后

### 运行中状态：

6. componentWillReceiveProps:组件将要接收到属性的时候调用

7. shouldComponentUpdate:组件接受到新属性或者新状态的时候（可以返回 false，接收数据后不更新，阻止 render 调用，后面的函数不会被继续执行了）
   shouldComponentUpdate 这个方法用来判断是否需要调用 render 方法重新描绘 dom。因为 dom 的描绘非常消耗性能，如果我们能在 shouldComponentUpdate 方法中能够写出更优化的 dom diff 算法，可以极大的提高性能

8. componentWillUpdate:组件即将更新不能修改属性和状态

9. render:组件重新描绘

10. componentDidUpdate:组件已经更新

### 销毁阶段：

11. componentWillUnmount:组件即将销毁

## 虚拟 dom

相当于在 js 和真实 dom 中间加了一个缓存，利用 dom diff 算法避免了没有必要的 dom 操作，从而提高性能。

具体实现步骤如下：

1. 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
3. 把 2 所记录的差异应用到步骤 1 所构建的真正的 DOM 树上，视图就更新了

### 步骤 1 virtualDOM 算法的实现思想

```js
var element = {
  tagName: 'ul', // 节点标签名
  props: {
    // DOM的属性，用一个对象存储键值对
    id: 'list'
  },
  children: [
    // 该节点的子节点
    { tagName: 'li', props: { class: 'item' }, children: ['Item 1'] },
    { tagName: 'li', props: { class: 'item' }, children: ['Item 2'] },
    { tagName: 'li', props: { class: 'item' }, children: ['Item 3'] }
  ]
}
```

上面对应的 HTML 的写法是:

```html
<ul id="list">
  <li class="item">Item 1</li>
  <li class="item">Item 2</li>
  <li class="item">Item 3</li>
</ul>
```

### 步骤 2 比较两个虚拟 dom 的差异
