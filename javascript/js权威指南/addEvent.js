function addEvent(target, type, handler) {
  if (target.addEventListener) {
    target.addEventListener(type, handler)
  } else {
    target.attachEvent('on' + type, function(event) {
      return handler.call(target, event)
    })
  }
}
