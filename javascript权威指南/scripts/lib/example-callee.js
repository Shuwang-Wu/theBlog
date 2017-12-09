/* 
* 在ES5严格模式下，这两个方法都会报类型错误
*/
define(function () {
  return factorial = function (x) {
    if (x < 1) return 1
    return x * arguments.callee(x - 1);
    
  }
})