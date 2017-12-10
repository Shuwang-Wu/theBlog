/**
 * tip: 所有的新建的函数（ex: function fun() {}）是Function函数类的一个实例，都包含_proto_和prototype属性指向函数类，
 *      而作为构造函数的函数类（即Function）, 里面都包含了一些公共内置函数（ex: toString, indexOf, call, apply, bind...）
 * 
 * _proto_与prototype的关系如下： 即 
 *    function Fun() {};
 *    var oFun = new Fun();
 *    oFun._proto_ === Fun.prototype;
 *    // oFun.excuteSomeMethod();
 *    // oFun.excuteSomeMethod 是否存在，若有直接调用，如果没有则通过_proto_属性到构造函数的原型上查找，即Fun.prototype
 *    // 如果oFun._proto_没有 --> oFun._proto_._proto...一直向上寻找 
 *    // 换成Fun.prototype --> Fun.prototype.prototype ...一直向上寻找 
 *    // 如果在最上层没有找到则报错: Uncaught TypeError: oFun.excuteSomeMethod is not a function
 * 
 * 
*/
define(function () {
  // 构造函数
  function animal() {
    console.log('constructor: animal');
  }
  // 在原型上定义公共方法，所有通过上面构造函数新建的实例都可以共享
  animal.prototype.info = function (type = 'unkowned', species = 'unkowned') {
    console.log(`type: ${type}, species: ${species}`);
  }
  // 创建对象（实例）
  var Animal = new animal();
  var
  return {
    boolean_equals: function () {

    }
  }
});