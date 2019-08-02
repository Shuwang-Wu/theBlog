var unmountComponentCode = {
  unmountComponent: function(safely) {
    if (!this._renderedComponent) {
      return
    }
    var inst = this._instance
    // 如果存在 componentWillUnmount，则调用
    if (inst.componentWillUnmount) {
      if (safely) {
        var name = this.getName() + '.componentWillUnmount()'
        ReactErrorUtils.invokeGuardedCallback(
          name,
          inst.componentWillUnmount.bind(inst)
        )
      } else {
        inst.componentWillUnmount()
      }
    }
    // 如果组件已经渲染，则对组件进行 unmountComponent 操作
    if (this._renderedComponent) {
      ReactReconciler.unmountComponent(this._renderedComponent, safely)
      this._renderedNodeType = null
      this._renderedComponent = null
      this._instance = null
    }
    // 重置相关参数、更新队列以及更新状态
    this._pendingStateQueue = null
    this._pendingReplaceState = false
    this._pendingForceUpdate = false
    this._pendingCallbacks = null
    this._pendingElement = null
    this._context = null
    this._rootNodeID = null
    this._topLevelWrapper = null
    // 清除公共类
    ReactInstanceMap.remove(inst)
  }
}
