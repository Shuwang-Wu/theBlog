# hightop

UI 库是一套功能强大的界面组件库，基于 HT 核心包的优秀架构和 HTML5 先进的 Canvas 机制，具有易上手、高性能、易扩展、组件丰富、跨平台等特点。

## 主要特性

1. Border 接口支持定义任意类型的组件边框
2. Drawable 接口支持定义任意类型的组件背景和图标
3. 包含数十种组件，并且提供了良好的封装接口，可以方便的自定义自己的组件
4. 提供功能强大的布局器，提供完整的组件布局生命周期，可以方便的自定义布局器
5. 完善的拖拽 API，允许组件之间通过拖拽交换数据
6. 支持界面序列化和反序列化，界面可以以 JSON 字符串的方式存储
7. 支持类似 CSS 的方式外部配置风格，可以方便的定义多套界面风格
8. 提供包装类方便与其它 UI 框架集成

## ui 库中包含的组件和接口

- ht HT 框架唯一的全局对象，其他类和包的起始点
  - ui UI 包，UI 库所有的类皆在此包下
    - Interactor 交互器的基类，封装了组件交互的基础功能
    - View UI 库中所有可视化组件的基类
    - ViewGroup 布局器基类
    - SplitLayout 分割布局器，拥有左右或者上下分割组件
    - TabLayout 页签布局器，以页签的方式呈现多组件，页签支持拖拽和关闭等功能
    - 等等 详细可查看官方文档 https://www.hightopo.com/ui/guide/zh/beginner/ht-ui-beginner-guide.html#ref_description

## DOM 结构

UI 库中每个组件都有一个 DOM 树结构, 包含交互 Div, 绘制 canvas 等，典型的组件结构如下：
[DOM 结构]('./assets/imgs/view.png')

- View(Div)
  组件最根层的 DOM 节点，可通过 getView() 获取；这个 Div 上的 htComp 属性指向组件引用，如 button.getView().htComp 可以获取到按钮实例
