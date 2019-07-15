# ES6

Promise

1. 概述
   是一种解决方案, 为了解决以往异步请求中的回调嵌套问题,
   相当于一个容器, 有三种状态：pending, resolve(fullfilled), reject; 将异步请求当前同步请求的模式来进行编写; 提供了统一的接口, 对控制流程更加方便
   缺点: 一旦创建无法取消, 无法获知当前处于哪个阶段(譬如 pending --> resolve), 需要传入回调函数获取数据到外部进行操作

2. 属性
   - then function(resolveFun, rejectFun)

- catch
