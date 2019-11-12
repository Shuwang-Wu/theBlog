/*eslint-disable*/
function _new(fn) {
  var obj = new Object() // or var obj = {}
  obj.__proto__ = fn.prototype
  fn.call(obj)
  return obj
}
