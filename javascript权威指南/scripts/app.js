requirejs.config({
  // 这里设置相对于html的基础路径
  baseUrl: "scripts/lib",
  paths: {
    "exampleCallee": "example-callee"
  }
});
require(['exampleCallee'], function (exampleCallee) {
  let calleeExample_result = exampleCallee(10);
  console.log(calleeExample_result);
});