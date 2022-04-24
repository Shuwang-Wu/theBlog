# Vue.use

1. vue.use 语法

```js
import Vue from 'vue'
Vue.use(options, arguments)
// * 组件类型必须为function || object
// * 如果是对象则必须提供install方法, 如果是函数则会被当成install函数直接执行
```

2. Vue.use 源码分析

```js
import { toArray } from '../util/index'

export function initUse(Vue: GlobalAPI) {
  // 限制了自定义组建的类型
  Vue.use = function (plugin: Function | Object) {
    //保存注册组件的数组，不存在及创建
    const installedPlugins =
      this._installedPlugins || (this._installedPlugins = [])
    //判断该组件是否注册过，存在return Vue对象
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }
    //调用`toArray`方法
    const args = toArray(arguments, 1)
    //将Vue对象拼接到数组头部
    args.unshift(this)
    //如果组件是对象，且提供install方法，调用install方法将参数数组传入，改变`this`指针为该组件
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
      //如果传入组件是函数，这直接调用，但是此时的`this`指针只想为`null`
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    //在保存注册组件的数组中添加
    installedPlugins.push(plugin)
    return this
  }
}
```

3. toArray 源码

```js
export function toArray(list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  //将存放参数的数组转为数组，并除去第一个参数（该组件）
  const ret: Array<any> = new Array(i)
  //循环拿出数组
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```
