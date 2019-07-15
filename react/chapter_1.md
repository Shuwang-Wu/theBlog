# 第一章 初入 react 世界

## 1.1 React 简介

1. 专注视图层
   不仅专注于解决 view 层，又是一个包括 view 和 controller 的库
2. Virtual DOM

3. 函数是编程(react 的精髓)

## 1.2 JSX 语法

1. JSX 的由来
   为方便 view 层组件化，承载了构建 HTML 结构化页面的职责，不用之处是在于 react 是通过创建与更新虚拟元素来管理整个 virtual DOM 的
2. JSX 基本语法

## 1.3 React 组件

基本的封装性
简单的生命周期呈现
明确数据流动

### 关于 Web Component

- HTML Template 定义了之前模版的概念
- Custom element 定义了组件的展现形式
- Shadow DOM 定义了组件的作用域范围
- HTML Import 提出了新的引用方式

### React 组件的构建

- 属性
- 状态
- 生命周期

### React 与 Web Component

- React 自定义元素是库自己构建的，与 Web Components 规范并不通用
- 渲染过程包含了模版的概念，
- 组件的实现均在方法与类中，因此可以做到相互隔离，但不包括样式
- 引用方式遵循 ES6 module 标准

## 1.4 React 数据流

React 中数据是自顶向下单项流动的

## 1.5 React 生命周期

### 1.5.1 当组件在挂载或卸载时

### 1.5.1 当组件接收新的数据时，即组件更新时

## 1.6 React 与 DOM

- React API
  1. findDOMNode 返回该 React 组件实例相应的 DOM 节点
  2. unmountComponentAtNode
  3. render
