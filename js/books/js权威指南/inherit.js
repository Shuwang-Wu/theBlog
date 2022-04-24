/*eslint-disable*/
function inherit() {
  if (p == null) throw TypeError()
  if (Object.create) return Object.create(p)
  var t = typeof p
  if (t !== 'object' && t != 'function') throw TypeError()
  function F() {}
  F.prototype = p
  return new F()
}
