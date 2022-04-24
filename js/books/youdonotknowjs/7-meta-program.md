# 7 元编程

> 元编程是指操作目标是程序本身的行为特性的编程, 换句话说, 它是对程序的编程的编程。
> 元编程关注以下一点或几点：代码查看自身、代码修改自身、代码修改默认语言特性，以此影响其他代码
> 元编程的目标是利用语言自身的内省能力使代码的其余部分更具描述性、表达性和灵活性。因为元编程的元（meta）本质，我们有点难以给出比上面提到的更精确的定义

## 7.1 函数名称
你的代码在有些情况下可能想要了解自身，想要知道某个函数的名称是什么。如何得知一个函数的名称，答案出人意料地有些模棱两可。考虑：
```js
function daz() {}
var obj = {
  foo: function() {},
  bar: function baz() {},
  bam: daz,
  zim() {}
}
// 上面的名称是什么呢?
// 如果在一个函数中传入一个回调函数, 它的名称是什么呢? 如果回调函数是匿名函数呢?
function foo (cb) {
  // 这里cb的名称是什么
  console.log(cb)
}
foo(function() {
  // 我是匿名的
})
```

## 7.2 元属性
元属性。正如其名称所暗示的，元属性以属性访问的形式提供特殊的其他方法无法获取的元信息。
以new.target为例，关键字new用作属性访问的上下文。显然，new本身并不是一个对象，因此这个功能很特殊。而在构造器调用（通过new触发的函数/方法）内部使用new. target时，new成了一个虚拟上下文，使得new.target能够指向调用new的目标构造器。这个是元编程操作的一个明显示例，因为它的目的是从构造器调用内部确定最初new的目标是什么，通用地说就是用于内省（检查类型/结构）或者静态属性访问。
```js
class Parent {
  constructor() {
    if (new.target === Parent) {
      console.log('Parent instantiated')
    } else {
      console.log('A child instantiated')
    }
  }
}

class Child extends Parent {

}

var p = new Parent()
// Parent instantiated
var c = new Child()
// A child instantiated'
```

## 7.3 公开符号
除了在自己的程序中定义符号之外，JavaScript预先定义了一些内置符号，称为公开符号（Well-Known Symbol, WKS）。

1. Symbol.iterator
   Symbol.iterator表示任意对象上的一个专门位置（属性），语言机制自动在这个位置上寻找一个方法，这个方法构造一个迭代器来消耗这个对象的值。很多对象定义有这个符号的默认值。
   然而，也可以通过定义Symbol.iterator属性为任意对象值定义自己的迭代器逻辑，即使这会覆盖默认的迭代器。这里的元编程特性在于我们定义了一个行为特性，供JavaScript其他部分（也就是运算符和循环结构）在处理定义的对象时使用。
   ```js
   var arr = [4, 5, 6, 7, 8, 9]
   for (var v of arr) {
     console.log(v)
   }
   arr[Symbol.iterator]= function* () {
     var idx = 1
     console.log(idx)
     do {
       yield this[idx]
     } while ((idx += 2) < this.length)
   }
   for (var v2 of arr) {
     console.log(v)
   }
   ```
2. Symbol.toStringTag & Symbol.hasInstance
   最常见的一个元编程任务，就是在一个值上进行内省来找出它是什么种类，这通常是为了确定其上适合执行何种运算。对于对象来说，最常用的内省技术是toString()和instanceof。
   ```js
   function Foo () {

   }

   var f = new Foo() 
   f.toString()
   // [object, object]
   f instanceOf Foo
   // true
   ```
   在ES6中，可以控制这些操作的行为特性：
   ```js
    function Foo (greeting) {
     this.greeting = greeting
    }
    Foo.prototype[Symbol.toStringTag] = 'Foo'
    Object.defineProperty(Foo, Symbol.hasInstance, {
      value: function(inst) {
        return inst.greeting === 'hello'
      }
    })
    
   ```
3. Symbol.species
    这个符号控制要生成新实例时，类的内置方法使用哪一个构造器。
    ```js
    class Cool {
      static get [Symbol.species] () {
        return this
      }
      again () {
        return new this.constructor[Symbol.species]()
      }
    }
    class Fun extends Cool {

    }
    class Awesome extends Cool {
      // 强制指定@@species为父构造器
      static get [Symbol.species] () {
        return Cool
      }
    }
    var a = new Fun()
    var b = new Awesome()
    var c = a.again()
    var d = b.again()
    console.log(c instanceof Fun)
    console.log(d instanceof Awesome)
    console.log(d instanceof Cool)
    ```
4. Symbol.toPrimitive
    它用在对象为了某个操作（比如比较==或者相加+）必须被强制转换为一个原生类型值的时候。在ES6之前，没有办法控制这一行为。
    Symbol.toPrimitive方法根据调用ToPrimitive的运算期望的类型，会提供一个提示（hint）指定"string"、"number"或"default"（这应该被解释为"number"）。在前面的代码中，加法+运算没有提示（传入"default"）。而乘法＊运算提示为"number", String(arr)提
    ```js
    var arr = [1, 2, 3, 4, 5];
      arr[Symbol.toPrimitive] = function (hint) {
        debugger
        if (hint == "default" || hint == "number") {
          return arr.reduce(function (acc, curr) {
            return (acc += curr);
          }, 0);
        }
      };
      // 25
      console.log(arr + 10);
      // 15a
      console.log(arr + 'a');
      // 30
      console.log(arr + arr);
      // 15[object, object]
      console.log(arr + {});
      // 150
      console.log(arr * 10);
    ```
5. 正则表达式符号
    对于正则表达式对象，有4个公开符号可以被覆盖，它们控制着这些正则表达式在4个对应的同名String.prototype函数中如何被使用。
    - match 
      正则表达式的Symbol.match值是一个用于利用给定的正则表达式匹配一个字符串值的部分或全部内容的方法。如果传给String.prototype.match(..)一个正则表达式，那么用它来进行模式匹配。 
    - replace
      正则表达式的Symbol.replace值是一个方法，String.prototype.replace(..) 用它来替换一个字符串内匹配给定的正则表达式模式的一个或多个字符序列。
    - search：
      正则表达式的Symbol.search值是一个方法，String.prototype.search(..)用它来在另一个字符串中搜索一个匹配给定正则表达式的子串
    - split：正则表达式的Symbol.split值是一个方法，String.prototype.split(..)用它把字符串在匹配给定正则表达式的分隔符处分割为子串
6. Symbol.isConcatSpreadable
    isConcatSpreadable可以被定义为任意对象（比如数组或其他可迭代对象）的布尔型属性（Symbol.isConcatSpreadable），用来指示如果把它传给一个数组的concat(..)是否应该将其展开。
    ```js
    var a = [1, 2, 3]
    var b = [4, 5, 6]
    b[Symbol.isConcatSpreadable] = false
    a.concat(b)
    // [1, 2, 3, [4, 5, 6]]
    ```

7. Symbol.unscopables
    unscopables可以被定义为任意对象的对象属性（Symbol.unscopables），用来指示使用with语句时哪些属性可以或不可以暴露为词法变量。

## 7.4 Proxy
ES6中新增的最明显的元编程特性之一是Proxy（代理）特性。
代理是一种由你创建的特殊的对象，它“封装”另一个普通对象——或者说挡在这个普通对象的前面。你可以在代理对象上注册特殊的处理函数（也就是trap），代理上执行各种操作的时候会调用这个程序。这些处理函数除了把操作转发给原始目标/被封装对象之外，还有机会执行额外的逻辑。
```js
var obj = { a: 1 }
handlers = {
  get (target, key, context) {
    // 注意:target === obj 
    // context === proj
    console.log('accessing: ', key)
    return Reflect.get(target, key, context)
  }
}
var porj = new Proxy(obj, handlers)
obj.a
proj.a
```
这里的映射是有意对称的。每个代理处理函数在对应的元编程任务执行的时候进行拦截，而每个Reflect工具在一个对象上执行相应的元编程任务。每个代理处理函数都有一个自动调用相应的Reflect工具的默认定义。几乎可以确定Proxy和Reflect总是这么协同工作的。
下面所列出的是在目标对象/函数代理上可以定义的处理函数，以及它们如何/何时被触发
- 通过[[Get]]，在代理上访问一个属性（Reflect.get(..)、 .属性运算符或[ .. ]属性运算符）