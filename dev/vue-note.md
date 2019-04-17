#vue

## Prop 验证

```js
props: {
  // 指定传入的值类型
  propA: Number,
  // 同上，其中之一即可
  propB: [String, Number],
  // 指定类型且设置默认值
  propC: {
    type: Number,
    default: 1
  },
  // 是否为必传属性
  propD: {
    required: true | false
  },
  //
  propE: {
    type: Object,
    //  如果传入的属性类型是对象或者数组, 默认值必须从一个工厂函数返回 为什么呢 ？ 暂时没有找到答案！
    default: function() {
      return { message: 'return from factory function'}
    }
  },
  propF: {
    type: Object,
    validator: function(obj) {
      return obj.name === 'sw'
    }
  }
}
```

## computed

如果计算的逻辑复杂，应当使用 computed, 与 method 的区别是其会缓存计算结果

```js
export default {
  name: 'example',
  data() {
    return {
      str: '123'
    }
  },
  computed: {
    reverseStr() {
      return this.str
        .split('')
        .reverse()
        .join()
    },
    fullName: {
      // getter
      get: function() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set: function(newVal) {
        var names = (newVal.split(' ')
        ;[(this.firstName, this.lastName)] = names)
      }
    }
  }
}
```

## mixin

混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式;
混入对象可以包含任意组件选项;
当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项;
自己的一些理解：mixin 就是相当于基类，所有通过集成基类的对象都可以调用其方法和属性

1. 基础

```js
var myMixin = {
  created: function() {
    this.hello()
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!')
    }
  }
}

var Component = Vue.extend({
  mixins: [myMixn]
})

var component = new Compoent() // => "hello from mixin"
```

2. 选项合并
3. 全局混入
4. 自定义选项合并策略

## directive

1. 周期函数

```js
Vue.directive('focus', {
  bind: function() {},
  inserted: function(el) {
    el.focus()
  },
  update: function() {},
  componentUpdated: function() {},
  unbind: function() {}
})
// <input v-focus />
<>
```

2. 钩子函数的参数
   2.1 el: 指令所绑定的元素, 可以用来直接操作 DOM;
   2.2 binding

   ```js
   binding: {
     name: 指令名
     value: 指令的绑定值
     oldValue: 指令的前一个绑定值
     expression: 字符串形式的指令表达式
     arg: 传给指令的参数
     modifier: 一个包含修饰符的对象
   }
   ```

   2.3 vnode: Vue 编译生成的虚拟节点
   2.4 oldVnode: 上一个虚拟节点

3. 函数简写
   如果想在 bind 和 uodate 时触发相同行为, 其他的钩子函数不作处理

```js
Vue.directive('red', function(el, binding) {
  el.style.backgroundColor = 'red'
})
```

4. 对象字面量
   如果指令需要传入多个值, 可以采用对象字面量的方式

   ```js
   Vue.directive('print',function(el, binding){
     console.log(binding.value) // {{a: 1, b: 2}}
   })
   <!-- <div v-print="{a: 1, b: 2}"></div> -->
   ```

## 渲染函数&jsx

```js
Vue.component('anchored-heading', {
  render: function(createElement) {
    return createElement('h' + this.level, this.$slot.default)
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

1. createElement 参数
