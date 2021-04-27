function observe(changes) {
  for (var change of changes) {
    if (change.type === 'recalc') {
      change.object.c = change.object.oldValue + change.object.a + change.object.b
    }
  }
}

function changeObj(a, b) {
  var notifier = Object.getNotiffier(obj)
  obj.a = a * 2
  obj.b = b * 2
  notifier.notify({
    type: 'recalc',
    name: 'c',
    oldValue: obj.c
  })
}

var obj = {
  a: 1,
  b: 2,
  c: 3
}

Object.observe(obj, observe, ['recalc'])

changeObj(3, 11)

console.log(obj.a)
console.log(obj.b)
console.log(obj.c)