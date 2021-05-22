# Vue3.0

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
