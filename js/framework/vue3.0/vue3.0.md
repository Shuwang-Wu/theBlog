# Vue3.0

## 优势

### Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 源码体积的优化
   1. 重写了虚拟dom
2. 响应式系统的升级
   1. 用 Proxy 和 Reflect 来代替 vue2 中的 Object.definepeoperty()方法来重写响应式
   2. vue3 中可以监听动态新增的属性
   3. vue3 中可以监听删除的属性
   4. vue3 中可以监听数组的索引和 length 属性
3. 代码编译优化
   1. 使用了 组合 API 来代替 vue2 中的 Options API
   2. 组件内不需要根节点了，使用 fragment(代码片段)代替了，fragment(代码片段)不会在页面显示
   3. vue3 中标记和提升所有的静态根节点，diff 的时候只需要对比动态节点内容

### Vue 3.0 所采用的 Composition Api 与 Vue 2.x 使用的 Options Api 有什么区别？
1. 代码更利于维护和封装
2. Vue2 中,我们会在一个 vue 文件的 data，methods，computed，watch 中定义属性和方法，共同处理页面逻辑 ,一个功能的实现，代码过于分散,vue3 中,代码是根据逻辑功能来组织的，一个功能的所有 api 会放在一起（高内聚，低耦合），提高可读性和可维护性,基于函数组合的 API 更好的重用逻辑代码
3. Vue3 中用 setup 函数代替了 Vue2 中的 befareCreate 和 created, onUnmounted 代替了 Vue2 中的 beforeDestory, unmounted 代替了 Vue2 中的 destroyed

## 使用方法

1. 确保node npm的版本是与vue-next要求的一致

2. 升级vue-cli至vue-cli4.0以上

  ```bush
  npm uninstall vue-cli
  npm install vue-cli
  vue -V 
  ```

3. 初始化项目

   ```bush
   <!-- 在此期间选择vue-router,vuex, 下面会自动升级 -->
   vue create yourApp
   ```

4. 升级项目到3.0版本(期间会自动安装一些插件之类的)

  ```bush
   vue add vue-next
   ```

5. 运行项目即可

  ```bush
  npm run serve
  ```

## Vue3.0新特性

### compositionAPI

1. ref
    <!-- 不需要在data中声明变量，而是使用ref -->
   ```js
    import { ref } from 'vue'
    export default {
      name: 'MyComponent',
      setup() {
        // 获取count的值为count.value
        const  count  = ref(0)
        return {
          count
        }
      }
    }
   ```

2. computed

   ```js
   import { ref, computed } from 'vue'
   export default {
      name: 'MyComponent',
      setup() {
        const  count  = ref(0)
        const doubleCount => computed(() => count.value * 2)
        return {
          count,
          doubleCount
        }
      }
    }
   ```

3. method

   ```js
   import { ref } from 'vue'
   export default {
      name: 'MyComponent',
      setup() {
        const  count  = ref(0)
        const add = () => {
          return count.value++
        }
        return {
          count,
          add
        }
      }
    }
   ```

4. watch

   ```js
   import { ref, watch } from 'vue'
   export default {
      name: 'MyComponent',
      setup() {
        const  count  = ref(0)
        watch(()=> count.value, val =>{
          console.log(val)
        })
        return {
          count
        }
      }
    }
   ```
