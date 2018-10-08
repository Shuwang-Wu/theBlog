"use strict";
/* 
*	parseInt(String, radix): 解析一个传入的字符串，并会返回指定基数的整数，默认是10；
*	map: 是在最近的 ECMA-262 标准中新添加的方法；
*		1 map的回调函数中每次都会传入三个参数，array.map(currentValue, key, array);
		2 返回原数组中的每个值调用了指定的方法后的数组；
		3 下面分别是map常用的一些方法
*/

// interview question

// result: 1, NaN, NaN

// map 使用例子

// 求平方根
function arr_sqrt_fun() {
  var arr_sqrt = [1, 4, 9];
  arr_sqrt.map((v, k) => {
    arr_sqrt[k] = Math.sqrt(v);
  });
  console.log(arr_sqrt);
}
arr_sqrt_fun();

// 使用map重新格式化数组中的对象
function arr_reformattObject_fun() {
  var arr_reformattObject = [{
    key: 1,
    value: 10
  }, {
    key: 2,
    value: 20
  }, {
    key: 3,
    value: 30
  }];
  var reformatt_object = arr_reformattObject.map((v, k, arr) => {
    var newObject = {};
    newObject[arr[k].key] = arr[k].value;
    return newObject;
  });
  console.log(arr_reformattObject); // [{key: 1, value: 10}, {key: 2, value: 20}, {key: 3, value: 30}]
  console.log(reformatt_object); // [{1: 10}, {2: 20}, {3: 30}]
}
// arr_reformattObject_fun();


// 一般的使用方法
function map_method_ordinaty() {
  var map = Array.prototype.map;
  var str = "hello,map";
  var arr_str = map.call(str, (v) => {
    return v;
  });
  console.log(arr_str); //["h", "e", "l", "l", "o", ",", "m", "a", "p"];
}
// map_method_ordinaty();

// querySelectorAll 的应用
function map_method_queryAll() {
  let divs = docuemnt.querySelectorAll("div");
  let div_map_method_queryAll = Array.prototype.map.call(divs, (singleDiv) => {
    return singleDiv.style.color;
  });
  console.log(div_map_method_queryAll); // ...
}
// map_method_queryAll();

// 反转字符串
function map_method_reverseStr() {
  let str = "hello,map";
  var reverse_str = Array.prototype.map.call(str, (v) => {
    return v;
  }).reverse().join("");
  console.log(str);
  console.log(reverse_str);
}
// map_method_reverseStr();

// polyfill
// 实现 ECMA-262, Edition 5, 15.4.4.19
// 参考: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map) {
  Array.prototype.map = function (callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. 将O赋值为调用map方法的数组.
    var O = Object(this);

    // 2.将len赋值为数组O的长度.
    var len = O.length >>> 0;

    // 3.如果callback不是函数,则抛出TypeError异常.
    if (Object.prototype.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 5. 创建新数组A,长度为原数组O长度len
    A = new Array(len);

    // 6. 将k赋值为0
    k = 0;

    // 7. 当 k < len 时,执行循环.
    while (k < len) {

      var kValue, mappedValue;

      //遍历O,k为原数组索引
      if (k in O) {

        //kValue为索引k对应的值.
        kValue = O[k];

        // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
        mappedValue = callback.call(T, kValue, k, O);

        // 返回值添加到新数组A中.
        A[k] = mappedValue;
      }
      // k自增1
      k++;
    }

    // 8. 返回新数组A
    return A;
  };
}