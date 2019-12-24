/*eslint-disable*/
function run(gen) {
  var args = [].slice.call(arguments, 1),
    it
  // 在当前上下文中
  it = gen.apply(this, args)
  // 返回一个Promise用于生成器完成
  return Promise.resolve().then(function handleNext(value) {
    var next = it.next(value)
    return (function handleResult(next) {
      if (next.done) {
        return next.value
      } else {
        return Promise.resolve(next.value).then(handleNext, function handleErr(err) {
          return Promise.resolve(it.throw(err)).then(handleResult)
        })
      }
    })(next)
  })
}
