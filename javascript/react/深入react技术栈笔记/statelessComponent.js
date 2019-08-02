// 无状态组件只有一个 render 函数
StatelessComponent.prototype.render = function() {
  var Component = ReactInstanceMap.get(this)._currentElement.type
  // 没有 state 状态
  var element = Component(this.props, this.context, this.updater)
  warnIfInvalidElement(Component, element)
  return element
}
function shouldConstruct(Component) {
  return Component.prototype && Component.prototype.isReactComponent
}
