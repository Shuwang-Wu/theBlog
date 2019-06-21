# 核心模块

- 全局对象
- 常用工具
- 事件机制
- 文件系统访问
- HTTP 服务器与客户端

1. 全局对象
   1. 全局对象和全局变量
   2. process 是 global 对象的属性，描述当前 nodejs 进程状态
      - argv 命令行参数数组
2. 常用工具 util
   util.inherits(constructor, superConstructor)是一个实现对象间原型继承的函数
   util.inspect 将一个对象转化成字符串

3. 事件驱动 events
   1. 事件发动器 EventEmitter
      events 模块只提供了一个对象: events.EventEmitter, 核心就是事件发射与事件监听器功能的封装
      常用 api: on, emit, once, removeListener, removeAllListener
   2. error 事件
   3. 继承 EventEmitter: 某个实体功能的对象实现事件符合语义
4. 文件系统 fs
   与其他模块不同的是, fs 模块中所有的操作都提供了异步和同步的两个版本
5. HTTP 服务器与客户端
