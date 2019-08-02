ReactComponent.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState)
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState')
  }
}

function enqueueSetState(publicInstance, partialState) {
  var internalInstance = getInternalInstanceReadyForUpdate(
    publicInstance,
    'setState'
  )
  if (!internalInstance) {
    return
  }
  // 更新队列合并操作
  var queue =
    internalInstance._pendingStateQueue ||
    (internalInstance._pendingStateQueue = [])
  queue.push(partialState)
  enqueueUpdate(internalInstance)
}

function performUpdateIfNecessary(transaction) {
  if (this._pendingElement != null) {
    ReactReconciler.receiveComponent(
      this,
      this._pendingElement,
      transaction,
      this._context
    )
  }
  if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
    this.updateComponent(
      transaction,
      this._currentElement,
      this._currentElement,
      this._context,
      this._context
    )
  }
}
