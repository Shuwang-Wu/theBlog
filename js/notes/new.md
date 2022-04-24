<!--
 * @Description  : new 的过程发生了什么 ?
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-06-30 15:56:55
 * @LastEditTime : 2020-06-30 16:14:28
 * @FilePath     : \notes\notes\new.md
-->

# new 的过程发生了什么 ?

- 1. 创建一个空对象
- 2. 将这个对象的原型指向构造函数的原型
- 3. 改变构造函数的this指向该对象
- 4. 返回这个对象


```js
function NewFunc(func){
    var ret = {};
    if (func.prototype !== null) {
        ret.__proto__ = func.prototype;
    }
    var ret1 = func.apply(ret, Array.prototype.slice.call(arguments, 1));
    if ((typeof ret1 === "object" || typeof ret1 === "function") && ret1 !== null)               
    {
        return ret1;
    }
    return ret;
}
```
