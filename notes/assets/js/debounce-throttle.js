/*eslint-disable*/
const debounce = function(fn, interval, immediate) {
  var timerId = null
  return function() {
    var args = arguments
    clearTimeout(timerId)
    if (immediate) {
      var _immediate = !timerId
      timerId = setTimeout(() => {
        timerId = null
      }, interval)
      _immediate && fn.apply(this, args)
    } else {
      timerId = setTimeout(() => {
        fn.apply(this, args)
      }, interval)
    }
  }
}

const throttle = function(fn, immediate) {
  var previous = +new Date()
  var _immediate = true
  return function() {
    var curr = +new Date()
    var canExec = curr - previous >= 0
    if (immediate) {
      _immediate && fn.apply(this, arguments)
    } else {
      if (canExec) {
        fn.apply(this, arguments)
        previous = curr
      }
    }
  }
}
