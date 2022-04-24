/*eslint-disable*/
/**
 * tip: 所有的新建的函数（ex: function fun() {}）是Function函数类的一个实例，都包含_proto_和prototype属性指向函数类，
 *      而作为构造函数的函数类（即Function）, 里面都包含了一些公共内置函数（ex: toString, indexOf, call, apply, bind...）
 * _proto_与prototype: 
 * 
*/
define(function () {
  var demo = {
    sayWhoAmI: function (text) {
      alert(text);
      console.log(this);
    }
  }
  return {
    callDemo: function () {
      demo.sayWhoAmI.call(demo, 'call');
    },
    applyDemo: function () {
      demo.sayWhoAmI.apply(demo, ['apply']);
    }
  }
});