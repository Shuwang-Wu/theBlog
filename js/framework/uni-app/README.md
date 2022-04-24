<!--
 * @Description: uni-app
 * @Author: Shuwng_Wu
 * @Date: 2022-03-09 16:45:22
 * @LastEditor: Shuwang_Wu
 * @LastEditTime: 2022-03-10 10:35:42
-->

# uni-app

是一个使用 Vue.js (opens new window)开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台, 简而言之就是跨端

## 教程

### 工程

一个 uni-app 工程，就是一个 Vue 项目，你可以通过 HBuilderX 或 cli 方式快速创建 uni-app 工程

### 页面

#### 生命周期

1. onInit 监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
    仅百度小程序基础库 3.260 以上支持 onInit 生命周期
    其他版本或平台可以同时使用 onLoad 生命周期进行兼容，注意避免重复执行相同逻辑
    不依赖页面传参的逻辑可以直接使用 created 生命周期替代
1. onLoad 监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参
2. onShow 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
3. onReady 监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发(即动画可能会在改钩子函数调用之后执行)
4. onHide 监听页面隐藏
5. onUnload 监听页面卸载
6. nResize 监听窗口尺寸变化
   
#### 组件生命周期 
与vue保持一致