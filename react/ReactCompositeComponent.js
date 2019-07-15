var ReactCompositeComponent = {
  // 当组件挂载时，会分配一个递增编号，表示执行ReactUpdates时更新组件的顺序
  // 初始化组件，渲染标记，注册事件监听器
  mountComponent: function(
    transation,
    nativeParent,
    nativeContainerInfo,
    context
  ) {
    // 当前元素对应的上下文
    // 初始化公共类
    // 用于判断组件是否为stateless,无状态组件没有状态更新队列，它只专注于渲染
    // 这些初始化参数本应该在构造函数中设置
  }
}
