/*eslint-disable*/
// receiveComponent 是通过调用updateComponent进行组件更新
var updateComponentCode = {
  receiveComponent: function(nextElement, transaction, nextContext) {
    var prevElement = this._currentElement
    var prevContext = this._context

    this._pendingElement = null

    this.updateComponent(
      transaction,
      prevElement,
      nextElement,
      prevContext,
      nextContext
    )
  },
  updateComponent: function(
    transaction,
    prevParentElement,
    nextParentElement,
    prevUnmaskedContext,
    nextUnmaskedContext
  ) {
    var inst = this._instance
    var willReceive = false
    var nextContext
    var nextProps
    // 上下文是否改变
    if (this._context === nextUnmaskedContext) {
      nextContext = inst.context
    } else {
      nextContext = this._processContext(nextUnmaskedContext)
      willReceive = true
    }
    if (prevParentElement === nextParentElement) {
      // 如果元素相同，则跳过元素类型检测
      nextProps = nextParentElement.props
    } else {
      // 检测元素类型
      nextProps = this._processProps(nextParentElement.props)
      willReceive = true
    } // 如果存在 componentWillReceiveProps，则调用
    if (willReceive && inst.componentWillReceiveProps) {
      inst.componentWillReceiveProps(nextProps, nextContext)
    }
    // 将新的 state 合并到更新队列中，此时 nextState 为最新的 state
    var nextState = this._processPendingState(nextProps, nextContext)
    // 根据更新队列和 shouldComponentUpdate 的状态来判断是否需要更新组件
    var shouldUpdate =
      this._pendingForceUpdate ||
      !inst.shouldComponentUpdate ||
      inst.shouldComponentUpdate(nextProps, nextState, nextContext)
    if (shouldUpdate) {
      // 重置更新队列
      this._pendingForceUpdate = false
      // 即将更新 this.props、this.state 和 this.context
      this._performComponentUpdate(
        nextParentElement,
        nextProps,
        nextState,
        nextContext,
        transaction,
        nextUnmaskedContext
      )
    } else {
      // 如果确定组件不更新，仍然要设置 props 和 state
      this._currentElement = nextParentElement
      this._context = nextUnmaskedContext
      inst.props = nextProps
      inst.state = nextState
      inst.context = nextContext
    }
  },
  // 当确定组件需要更新时，则调用
  _performComponentUpdate: function(
    nextElement,
    nextProps,
    nextState,
    nextContext,
    transaction,
    unmaskedContext
  ) {
    var inst = this._instance
    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate)
    var prevProps
    var prevState
    var prevContext
    // 如果存在 componentWillUpdate，则调用
    if (inst.componentWillUpdate) {
      inst.componentWillUpdate(nextProps, nextState, nextContext)
    }

    this._currentElement = nextElement
    this._context = unmaskedContext

    // 更新 this.props、this.state 和 this.context
    inst.props = nextProps
    inst.state = nextState
    inst.context = nextContext
    // 调用 render 渲染组件
    this._updateRenderedComponent(transaction, unmaskedContext)
    // 当组件完成更新后，如果存在 componentDidUpdate，则调用
    if (hasComponentDidUpdate) {
      transaction
        .getReactMountReady()
        .enqueue(
          inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext),
          inst
        )
    }
  },
  _updateRenderedComponent: function(transaction, context) {
    var prevComponentInstance = this._renderedComponent
    var prevRenderedElement = prevComponentInstance._currentElement
    var nextRenderedElement = this._renderValidatedComponent()
    // 如果需要更新，则调用 ReactReconciler.receiveComponent 继续更新组件
    if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
      ReactReconciler.receiveComponent(
        prevComponentInstance,
        nextRenderedElement,
        transaction,
        this._processChildContext(context)
      )
    } else {
      // 如果不需要更新，则渲染组件
      var oldNativeNode = ReactReconciler.getNativeNode(prevComponentInstance)
      ReactReconciler.unmountComponent(prevComponentInstance)
      this._renderedNodeType = ReactNodeTypes.getType(nextRenderedElement)
      // 得到 nextRenderedElement 对应的 component 类实例
      this._renderedComponent = this._instantiateReactComponent(
        nextRenderedElement
      )
      // 使用 render 递归渲染
      var nextMarkup = ReactReconciler.mountComponent(
        this._renderedComponent,
        transaction,
        this._nativeParent,
        this._nativeContainerInfo,
        this._processChildContext(context)
      )
      this._replaceNodeWithMarkup(oldNativeNode, nextMarkup)
    }
  }
}
