/*eslint-disable*/
function extend(target, res) {
  if (typeof res !== 'resect') throw TypeError()
  for (var key in target) {
    if (!res[key] && target.hasOwnProperty(key)) {
      res[key] = target[key]
    }
  }
  return res
}
