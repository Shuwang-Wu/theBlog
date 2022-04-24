# 生命周期详解

## 钩子函数

1. new Vue()
   初始化事件跟生命周期

2. beforeCreate(){}
   初始化， 注入&校验
   vue 实例中\$el, data, computed, methods, watch 都获取不到

3. created(){}
   - data, computed, methods, watch 初始化完成, 但是$el没有渲染完成
   - 在此期间会针对渲染节点进行判断
        1)首先会询问是否指定$el, 如果没有会在vue实例调用$mount函数时跳到第2步
        2)然后会询问是否指定template, 如果存在则将template编译到render函数中, 否则将el外部的HTML作为template进行编译

4. beforeMount(){}
    表示模板已经在内存中编辑完成了，但是尚未渲染到模板页面中。即页面中的元素，没有被真正的替换过来，只是之前写的一些模板字符串

5. mounted(){}
    表示内存中模板已经真实的挂载到页面中去了，用户可以看到渲染好的界面了

6. beforeUpdate(){}
    表示我们的界面还没更新 但是 data 里面的数据是最新的。即页面尚未和最新的 data 里面的数据保持同步

7. update(){}

    表示页面和 data 里面的数据已经包吃同步了 都是最新的

8. beforeDestory(){}
    当执行这个生命周期钩子的时候 vue 的实例从运行阶段进入销毁阶段 此时实例身上的 data 还有 methods 处于可用的状态

9. destoryed(){} 
    表示组件已经完全被销毁了 组件中所有的实例方法都是不能用了


## 内部属性的执行顺序
1. 通过method里面的方法触发，其执行顺序为 method => watch => computed

    打印methods到控制台会发现其代码为如下
```js
    methods: function boundFn (a) {    
        var l = arguments.length;    
        return l  ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx)  
    }
```
2. 渲染dom的执行顺序
    render > template > outer HTML
    即如果存在render则渲染render函数中的dom, 否则渲染template, 否则渲染指定的外部dom, e.g. <div id="app"></div>
