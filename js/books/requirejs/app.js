/*eslint-disable*/
requirejs.config({
  // 这里设置相对于html的基础路径
  baseUrl: 'scripts/lib',
  paths: {
    exampleCallee: 'example-callee',
    check: 'check-args',
    caller: 'caller',
    callee: 'callee',
    callAndApply: 'callAndApply',
    _proto_prototype: '_proto_prototype',
    bind: 'bind'
  }
})
require(['check', 'callee', 'caller', 'callAndApply', '_proto_prototype', 'bind'], function(
  check,
  callee,
  caller,
  callAndApply,
  _proto_prototype,
  bind
) {
  let check_result = check(1, 2, 3)
  console.log(check_result)
  /**
   * call apply 第一个实参是要调用函数的母对象，它是调用的上下文，在函数体内通过this来引用它
   */
  caller()
  callee.printSelf()
  let countBycallee = callee.count(10)
  console.log(countBycallee)
  callAndApply.callDemo()
  callAndApply.applyDemo()
  _proto_prototype.boolean_equals()
  _proto_prototype.print()
  bind.excute_s(2)
  bind.excute_s2(1, 2)
})
