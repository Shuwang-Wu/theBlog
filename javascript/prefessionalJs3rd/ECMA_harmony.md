# ECMA Harmony

## 一般性变化

1. 常量
2. 块级作用域和其他作用域

## 函数

1. 剩余参数与分布参数

```js
function sum(num1, num2, ...nums) {
  var result = num1 + num2
  for (let i = 0; i < nums.length; i++) {
    result += nums[i]
  }
  return result
}

var result = sum(1, 2, 3, 4, 5, 6)
```

2. 默认参数值

```js
function sum(num1, num2 = 0) {}
```

3. 生成器

## 数组及其他结构

1. 迭代器
   new Iterator 暂时还未支持
2. 数组领悟
3. 解构赋值

## 新对象类型

1. 代理对象
   所谓代理就是一个表示接口的对象，对它的操作不一定作用在代理对象本身

   ```js
   var proxy = Proxy.create(handler)
   <!-- 创建一个以myObject为原型的代理对象 -->
   var proxy = Proxy.create(handler, myObject)
   ```

   其中 handler 对象包含用于定义捕捉器的属性

2. 代理函数
3. 映射与集合(Map)
