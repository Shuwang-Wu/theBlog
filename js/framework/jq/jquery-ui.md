# jquery UI

jQuery UI 是一个建立在 jQuery JavaScript 库上的小部件和交互库

## 特性

1. 简单易用
2. 开源免费
3. 广泛兼容
4. 轻便快捷
5. 标准先进
6. 美观多变
7. 开放公开
8. 强力支持
9. 完整汉化
10. 缺点不足：
    - 代码不够健壮：缺乏全面的测试用例，部分组件 Bugs 较多，不能达到企业级产品开发要求
    - 构架规划不足：组件间 API 缺乏协调，缺乏配合使用帮助
    - 控件较少：相对于 Dojo、YUI、Ext JS 等成熟产品，可用控件较少，无法满足复杂界面功能要求

## 工作原理

jQuery UI 包含了许多维持状态的小部件（Widget），因此，它与典型的 jQuery 插件使用模式略有不同。其安装方式与大部分 jQuery 插件的安装方式类似，jQuery UI 的小部件是基于 部件库（Widget Factory） 创建的，小部件库提供了通用的 API。
1. 安装

    为了跟踪部件的状态，我们首先介绍一下小部件的全生命周期。当小部件安装时，生命周期开始。我们只需要在一个或多个元素上调用插件，即安装了小部件

    ```js
        $( "#elem" ).progressbar();
        // 传入自定义的值, 覆盖默认值
        $( "#elem" ).progressbar({
            value: 20
        });
    ```

2. 方法
    所有初始化后的动作都以方法调用的形式进行

    ```js
        $( "#elem" ).progressbar( "value" );
        $( "#elem" ).progressbar( "value", 40 );
        <!-- 大部分的jq ui 会返回jquery对象 -->
        $( "#elem" ) .progressbar( "value", 90 ).addClass( "almost-done" );
        // 启用
        $( "#elem" ) .progressbar( "disable"); 
        // 禁用
        $( "#elem" ) .progressbar( "enable"); 
        // 销毁
        $( "#elem" ) .progressbar( "destory"); 
        // 一些小部件生成包装器元素，或与原始元素断开连接的元素。在下面的实例中，widget 将返回生成的元素。在进度条（progressbar）实例中，没有生成的包装器，widget 方法返回原始的元素
        $( "#elem" ).progressbar( "widget" );
    ```

    - 公共的事件
        大多数事件是针对特定的小部件，所有的小部件都有一个公共的 create 事件。该事件在小部件被创建时即被触发。

## jQuery UI 部件库（Widget Factory）

### 默认配置

- defaultElement: "<div>"
- destroy: ƒ ()
- disable: ƒ ()
- enable: ƒ ()
- option: ƒ ( key, value )
- options: {classes: {…}, disabled: false, create: null}
- widget: ƒ ()
- widgetEventPrefix: ""
- widgetName: "widget"
- _addClass: ƒ ( element, keys, extra )
- _classes: ƒ ( options )
- _create: ƒ ()
- _createWidget: ƒ ( options, element )
- _delay: ƒ ( handler, delay )
- _destroy: ƒ ()
- _focusable: ƒ ( element )
- _getCreateEventData: ƒ ()
- _getCreateOptions: ƒ ()
- _hide: ƒ ( element, options, callback )
- _hoverable: ƒ ( element )
- _init: ƒ ()
- _off: ƒ ( element, eventName )
- _on: ƒ ( suppressDisabledCheck, element, handlers )
- _removeClass: ƒ ( element, keys, extra )
- _setOptionClasses: ƒ ( value )
- _setOptionDisabled: ƒ ( value )
- _setOptions: ƒ ( options )
- _show: ƒ ( element, options, callback )
- _toggleClass: ƒ ( element, keys, extra, add )
- _trigger: ƒ ( type, event, data )
- _untrackClassesElement: ƒ ( event )

### $.widget

1. params

- fullName 当前部件的全称, 以.为分割符, 前面是命名空间, 后面是部件名称
- base 需要继承的组件
- prototype 插件的实际代码

```js
// fullName 以.为分割符, 前面是命名空间, 后面是部件名称
// base 需要继承的类 如果不传则默认继承 $.widget
// prototype 插件的实际代码
$.widget("custom.button", {
    value: 'this is a button',
    _create: function() {
        var self = $(this)
        // 设置按钮文字 从当前传入的组件选项中获取value的值
        self.html(this.options.value)
    }
})

```
