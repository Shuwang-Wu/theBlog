/**
 * callee 返回正在执行的对象，也就是的指定的Function上下文
*/
define(function () {
  // 打印自身，也就是正在执行的函数
  return {
    printSelf: function () {
      console.log(arguments.callee);
    },
    // 递归求和等操作
    count: function (n) {
      if (n > 0) {
        // return n + count.callee(n - 1);
        return n + arguments.callee(n - 1);
      } else {
        return 0;  
      }
    }
  }
});