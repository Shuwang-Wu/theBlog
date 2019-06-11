/**
 * caller 返回对一个函数的调用，该函数调用了当前的函数;
 * 只有在函数执行时才有定义，如果实在顶层（全局）调用则返回null;
 * */ 
define(function() {
  function caller_ex() {
    if(arguments.caller) {
      let caller_print = arguments.caller.toStirng();
      console.log(caller_print);
    } else {
      console.log('the function excute in global');
    }
  }
  return caller_ex;
});