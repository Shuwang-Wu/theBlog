function inherit() {
  if (p == null) throw TypeError()
  if (Object.create) return Object.create(p)
  var t = typeof p
  if (t !== 'object' && t != 'function') throw TypeError()
  function F() {}
  F.prototype = p
  return new F()
}

function Range(from, to) {
  var r = inherit(range.methods)
  r.from = from
  r.to = to
}

Range.methods = {
  includes: function(val) {
    return val >= this.from && val < this.to
  },
  toString: function() {
    return `${this.from}...${this.to}`
  }
}

var range = Range(1, 10)
console.log(range.includes(1), range.includes(11))
