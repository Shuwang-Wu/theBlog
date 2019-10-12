# Vue keep-alive

在 vue 2.1.0 版本之后，keep-alive 新加入了两个属性:

1. include(包含的组件缓存生效)
2. exclude(排除的组件不缓存，优先级大于 include) 。

include 和 exclude 属性允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示。
**\* 当使用正则或者是数组时, 一定要使用 v-bind \*** !

include 和 exclude 里面的 name 要与组件中 export default 的 {name}保持一致，否则不会生效
