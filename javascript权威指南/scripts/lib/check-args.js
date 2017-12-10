define(function () {
  let check = function (args) {
    let actual = args.length; // 实参的真实个数
    /*
    * callee， 调用自身hna
    */
    let expected = args.callee.length; // 期望传入的实参个数
    if (actual !== expected) {
      throw Error(`Expected: ${expected} is not equal Actual: ${actual}`);
    }
  }
  function check_wrap(x, y, z) {
    check(arguments);
    return x + y + z;
  }
  return check_wrap;
});