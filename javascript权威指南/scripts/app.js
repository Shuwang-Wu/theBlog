requirejs.config({
  // 这里设置相对于html的基础路径
  baseUrl: "scripts/lib",
  paths: {
    "exampleCallee": "example-callee",
    "check": "check-args",
    "caller": "caller",
    "callee": "callee",
    "callAndApply": "callAndApply",
    "_proto_prototype": "_proto_prototype"
  }
});
require([
  'exampleCallee',
  'check',
  'callee',
  'caller',
  'callAndApply',
  '_proto_prototype'
], function (
  exampleCallee,
  check,
  callee,
  caller,
  callAndApply,
  _proto_prototype) {
    let calleeExample_result = exampleCallee(10);
    console.log(calleeExample_result);
    let check_result = check(1, 2, 3);
    console.log(check_result);
    /**
     * call apply 第一个实参是要调用函数的母对象，它是调用的上下文，在函数体内通过this来引用它
    */
    caller();
    callee.printSelf();
    let countBycallee = callee.count(10);
    console.log(countBycallee);
    callAndApply.callDemo();
    callAndApply.applyDemo();
  });