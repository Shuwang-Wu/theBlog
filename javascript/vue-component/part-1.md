# 组件

## 组件分类

1. 页面组件
   e.g.: vue-router 渲染的页面组件
2. 基础组件
   e.g.: 模态框组件, 日期组件等
3. 业务组件
   e.g.: 项目中会反复用到的组件, 可能还有自己的请求逻辑

## 组件 API

一个再复杂的组件, 都是由 prop, event, slot 组成的;

### 属性 prop

prop 定义了这个组件有哪些可配置的属性，组件的核心功能也都是它来确定的。写通用组件时，props 好 用对象的写法，这样可以针对每个属性设置类型、默认值或自定义校验属性的值

```vue
<template>
  <button :class="'i-button-size' + size" :disabled="disabled"></button>
</template>
```

```vue
<script>
// 判断参数是否是其中之一
function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
export default {
  props: {
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

### 事件 event
1. 在组件中触发通过父组件传递过来的事件
2. 直接在组件上绑定原生事件, 不过需要添加.native
   ```js
   <i-button @click.native="submit"> submit </i-button>
   ```

### 插槽 slot
需要在组件内部展示自定义内容的时可以使用插槽
```vue
<template>
  <button @click.native="submit"> 
    <slot name="icon"></slot>
    <slot>提交按钮</slot>
  </button>
</template>
```
展示多个内容则需要用到具名插槽

## 组件通信

### 内置通信
这两种方法的弊端是无法跨越层级或兄弟间通信
1. $refs 给元素或者组件注册引用信息 
2. \$parent/\$children 访问父/子实例

### provide/inject
1. 用法
```js
// A.vue 
export default {  
  provide: {     
    name: 'Aresn'   
  } 
} 
 
// B.vue 
export default {   
  inject: ['name'],   
  mounted () {     
    console.log(this.name);  // Aresn   
  } 
} 
```

2. 替代vuex
  ```vue
  <script>   
    export default {     
      provide () {       
        return {         
          app: this       
          }     
          },     
          data () {       
            return {         
              userInfo: null       
              }     
              },     
              methods: {       
                getUserInfo () { 
  ```


