<!--
 * @Author: shuwang_wu
 * @Date: 2021-07-23 19:46:16
 * @LastEditTime: 2021-07-23 20:07:14
 * @LastEditors: shuwang_wu
 * @Description: 前端异常监控
 * @FilePath: \notes\notes\catch-exception.md
-->

# 前端异常监控

前端监控包括行为监控、异常监控、性能监控等，本文主要讨论异常监控
一般而言，一个监控系统，大致可以分为四个阶段：日志采集、日志存储、统计与分析、报告和警告。

1. 采集阶段
   1. 收集异常日志，先在本地做一定的处理，采取一定的方案上报到服务器
2. 存储阶段
   1. 后端接收前端上报的异常日志，经过一定处理，按照一定的存储方案存储
3. 分析阶段
   1. 机器自动分析，通过预设的条件和算法，对存储的日志信息进行统计和筛选，发现问题，触发报警
   2. 人工分析，通过提供一个可视化的数据面板，让系统用户可以看到具体的日志数据，根据信息，发现异常问题根源
4. 报警阶段

## 前端异常

### 前端异常分类

1. 出错
2. 呆滞
3. 损坏
4. 假死
5. 崩溃

### 异常错误原因分类（主要分 5 类）

1. 逻辑错误
2. 数据类型错误
3. 语法句法错误
4. 网络错误
5. 系统错误

## 异常采集

### 采集内容

遵循 4W 原则： WHO did WHAT and get WHICH exception in WHICH environment?

1. 用户信息
2. 行为信息
3. 异常信息
4. 环境信息

- requestId String 一个界面产生一个 requestId
- traceId String 一个阶段产生一个 traceId，用于追踪和一个异常相关的所有日志记录
- hash String 这条 log 的唯一标识码，相当于 logId，但它是根据当前日志记录的具体内容而生成的
- time Number 当前日志产生的时间（保存时刻）
- userId String
- userStatus Number 当时，用户状态信息（是否可用/禁用）
- userRoles Array 当时，前用户的角色列表
- userGroups Array 当时，用户当前所在组，组别权限可能影响结果
- userLicenses Array 当时，许可证，可能过期
- path String 所在路径，URL
- action String 进行了什么操作
- referer String 上一个路径，来源 URL
- prevAction String 上一个操作
- data Object 当前界面的 state、data
- dataSources Array<Object> 上游 api 给了什么数据
- dataSend Object 提交了什么数据
- targetElement HTMLElement 用户操作的 DOM 元素
- targetDOMPath Array<HTMLElement> 该 DOM 元素的节点路径
- targetCSS Object 该元素的自定义样式表
- targetAttrs Object 该元素当前的属性及值
- errorType String 错误类型
- errorLevel String 异常级别
- errorStack String 错误 stack 信息
- errorFilename String 出错文件
- errorLineNo Number 出错行
- errorColNo Number 出错列位置
- errorMessage String 错误描述（开发者定义）
- errorTimeStamp Number 时间戳
- eventType String 事件类型
- pageX Number 事件 x 轴坐标
- pageY Number 事件 y 轴坐标
- screenX Number 事件 x 轴坐标
- screenY Number 事件 y 轴坐标
- pageW Number 页面宽度
- pageH Number 页面高度
- screenW Number 屏幕宽度
- screenH Number 屏幕高度
- eventKey String 触发事件的键
- network String 网络环境描述
- userAgent String 客户端描述
- device String 设备描述
- system String 操作系统描述
- appVersion String 应用版本
- apiVersion String 接口版本

### 异常捕获

1. 全局捕获
   通过全局的接口，将捕获代码集中写在一个地方，可以利用的接口有：
   1. window.addEventListener(‘error’) / window.addEventListener(“unhandledrejection”) / document.addEventListener(‘click’) 等
   2. 框架级别的全局监听，例如 aixos 中使用 interceptor 进行拦截，vue、react 都有自己的错误采集接口
   3. 通过对全局函数进行封装包裹，实现在在调用该函数时自动捕获异常
   4. 对实例方法重写（Patch），在原有功能基础上包裹一层，例如对 console.error 进行重写，在使用方法不变的情况下也可以异常捕获
2. 单点捕获
   在业务代码中对单个代码块进行包裹，或在逻辑流程中打点，实现有针对性的异常捕获：
   1. try…catch
   2. 专门写一个函数来收集异常信息，在异常发生时，调用该函数
   3. 专门写一个函数来包裹其他函数，得到一个新函数，该新函数运行结果和原函数一模一样，只是在发生异常时可以捕获异常
3. 跨域脚本捕获
   1. 方案一：
      1. 将 js 内联到 HTML 中
      2. 将 js 文件与 HTML 放在同域下
   2. 方案二：
      1. 为页面上 script 标签添加 crossorigin 属性
      2. 被引入脚本所在服务端响应头中，增加 Access-Control-Allow-Origin 来支持跨域资源共享
4. 异常录制
   录制通过“时间”“空间”两个维度记录异常发生前到发生的整个过程，对于找到异常根源更有帮助。所谓的“异常录制”，实际上就是通过技术手段，收集用户的操作过程，对用户的每一个操作都进行记录，在发生异常时，把一定时间区间内的记录重新运行，形成影像进行播放，让调试者无需向用户询问，就能看到用户当时的操作过程。
5. 异常级别

## 整理与上报方案

### 前端存储日志

cookie localStorage sessionStorage IndexedDB webSQL FileSystem
