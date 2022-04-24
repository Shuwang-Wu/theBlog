/*eslint-disable*/
/**
 * bind: 作用就是将某个函数绑定到某个对象, (es5中新增的方法，es3也可以模拟出来)
 * 
 * 当在一个函数上使用bind()方法传入一个对象作为参数，这个方法将返回一个新的函数，
 * 以函数调用的方式调用这个方法，调用方法会调用原始的函数当作这个这个对象的方法来调用，
 * 传入新函数的任何实参都将传入原是函数
 * 
 * 它不仅将函数绑定到一个对象，同时也将第一个实参之外的其他实参绑定到this, 即柯里化
 * 
 * es3 的Function.bind实现方法
 * if(!Function.prototype.bind) {
 *   Function.prototype.bind = function(o) {
 *     var self = this, boundArgs = arguments;
 *     return function() {
 *       var args = [];
 *       for (let i = 1; i < boundArgs.length; i++;) {
 *         args.push(boundArgs[i]);
 *       }
 *       for (let i = 0; i < arguments.length; i++;) {
 *         args.push(arguments[i]);
 *       }
 *       return self.apply(o, args);
 *     }
 *   }
 * }
*/
define(function () {
  var sum = function (x, y) {
    console.log(`sum: ${x + y}`);
  }
  var s = sum.bind(null, 1);
  function sum_2(y, z) {
    console.log(`sum: ${this.x + y + z}`)
  }
  var obj = { x: 1 }
  var s_2 = sum_2.bind(obj);
  return {
    excute_s: function (y) {
      s(y);
    },
    excute_s2: function(y, z) {
      s_2(y, z);
    }
  }
});