# Vue keep-alive

## intro

1. 在 vue 2.1.0 版本之后，keep-alive 新加入了两个属性:
   keepalive 是 Vue 内置的一个组件, 可以使被包含的组件保留状态，或避免重新渲染, 也就是所谓的组件缓存
2. keep-alive 的声明周期执行
   created-> mounted-> activated
   - 退出时触发 deactivated 当再次进入（前进或者后退）时，只触发 activated
   - 事件挂载的方法等，只执行一次的放在 mounted 中；组件每次进去执行的方法放在 activated 中
3. max 缓存组件的最大值(类型为字符或者数字,可以控制缓存组件的个数)

## prop

1. include: 字符串或正则表达式。只有匹配的组件会被缓存(包含的组件缓存生效)
2. exclude: 字符串或正则表达式。任何匹配的组件都不会被缓存(排除的组件不缓存，优先级大于 include)

include 和 exclude 属性允许组件有条件地缓存, 二者都可以用逗号分隔字符串、正则表达式或一个数组来表示.

## note

**_当使用正则或者是数组时, 一定要使用 v-bind _**

**_include 和 exclude 里面的 name 要与组件中 export default 的 {name}保持一致，否则不会生效_**

## example

### include 使用方法

```html
<!-- 将（只）缓存组件name为a或者b的组件, 结合动态组件使用 -->
<keep-alive include="a,b">
  <component></component>
</keep-alive>

<!-- 组件name为c的组件不缓存(可以保留它的状态或避免重新渲染) -->
<keep-alive exclude="c">
  <component></component>
</keep-alive>

<!-- 使用正则表达式，需使用v-bind -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 动态判断 -->
<keep-alive :include="includedComponents">
  <router-view></router-view>
</keep-alive>

<!-- 如果同时使用include,exclude,那么exclude优先于include， 下面的例子只缓存a组件 -->
<keep-alive include="a,b" exclude="b">
  <component></component>
</keep-alive>

<!-- 如果缓存的组件超过了max设定的值5，那么将删除第一个缓存的组件 -->
<keep-alive exclude="c" max="5">
  <component></component>
</keep-alive>
```

### 基本用法

```html
<keep-alive>
  <router-view v-if="$route.meta.keepAlive"></router-view>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```
