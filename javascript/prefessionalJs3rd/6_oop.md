# 面向对象的程序设计

本章内容

1. 理解对象属性
2. 理解并创建对象
3. 理解继承

## 理解对象

1. 属性类型
   ECMAScript 中有两种属性: 数据属性和访问器属性
2. 创建对象

   - 工厂模式

   ```js
   function createPerson(name, age) {
     var obj = {}
     obj.name = name
     obj.age = age
     return obj
   }
   var p1 = createPerson('kobe', 24)
   var p2 = createPerson('jordan', 23)
   ```

   - 构造函数模式
     必须使用 new 操作符
     则会经历下面 4 个步骤:
     (1) 创建一个新对象
     (2) 将构造函数的作用域赋给新对象(因此 this 就指向了这个新对象)
     (3) 执行构造函数中的代码(为这个新对象添加属性)
     (4) 返回新对象

   ```js
   function createPerson(name, age) {
     this.name = name
     this.age = age
   }
   var p1 = new createPerson('kobe', 24)
   var p2 = new createPerson('jordan', 23)
   ```

   构造函数的主要问题是每个方法都要在每个实例上定义一遍, 如果放到全局, 那自定义的引用类型就没有丝毫的封装性可言了

   - 原型模式
     我们创建的每个函数都有 Prototype 属性, 这个属性是一个指针, 指向一个对象, 而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法;
     字面意思可以理解为通过调用构造函数而创建的那个对象实例的原型对象;
     使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法
     (1) 理解原型对象
     a.无论什么时候, 只要创建了一个函数, 就会根据一组特定的规则为该函数创建一个 prototype 属性, 这个属性指向函数的原型对象
     b.当调用构造函数创建一个实例之后, 该实例内部将包含一个指针, 指向构造函数的原型对象, ECMA-262 中管这个指针叫\[\[prototype\]\]
     c.实例的\[\[prototype\]\]属性仅仅指向实例的原型对象, 与构造函数没有直接的关系
     ```js
     // 通过 isPrototypeOf 来确定是否是该实例的原型对象
     A.prototype.isPrototypeOf(a)
     Object.getPrototypeOf(a) == A.prototype // true
     ```

## 继承

### 寄生组合式继承

基本思路: 不必为了指定子类型的原型而调用超类型的构造函数, 我们所需要的无非就是超类型的一个副本而已, 本质上就是使用寄生式继承来继承超类型的原型, 然后再将指定结果指定给子类型的原型
通过借用构造函数来继承属性, 通过原型链的混成形式来继承方法

```js
function inheritPrototype(SuperType, SubType) {
  var prototype = object(SuperType.prototype)
  prototype.constructor = SubType
  Subtype.prototype = prototype
}

function SuperType(name, age) {
  this.name = name
  this.color = ['red', 'green', 'blue']
}
SuperType.prototype.sayName = function() {
  alert(this.name)
}
function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}
inheritPrototype(SuperType, SubType)
SubType.prototype.sayAge = function() {
  alert(this.age)
}
```
