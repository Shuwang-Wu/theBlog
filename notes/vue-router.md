# vue-router 复习笔记

## API

### <router-link>

1. to
   required 表示目标路由的链接

```html
<router-link to="home"></router-link>
<!-- 渲染结果  -->
<a href="home"></a>
<!-- 对象形式 -->
<router-link :to="{path: 'home'}"></router-link>
<!-- 路由传参 -->
<router-link :to="{path: 'home'}"></router-link>
<!-- 带查询参数 -->
<router-link to="{path: 'home', query: {id: 1}}"></router-link>
```

2. replace
   设置 replace 属性的话会调用 router.replace 而不是 router.push
   ```html
   <router-link to="{path: 'home', query: {id: 1}}" replace></router-link>
   ```
3. append
   设置 append 属性, 则在当前路径前添加基路径
   ```js
   <!-- 如果当前路径是/a -->
   <router-link to="a"></router-link>
   <!-- 未设置 append 路由地址变成/b -->
   <router-link to="b"></router-link>
    <!-- 设置 append 路由地址编程/a/b -->
   <router-link to="b" append></router-link>
   ```
4. active-class
   设置链接激活时使用的 CSS 类名
5. exact
   精确匹配
6. event
   声明可以用来触发导航的事件
7. exact-active-class
   设置精确匹配时样式的类名

### <router-view>

<router-view> 组件是一个 functional 组件，渲染路径匹配到的视图组件

1. name
   如果设置了 name 属性, 则会渲染对于的路由配置中 component 下的响应组件

### Router 构建选项

1. mode
   type: string
   default: 'hash'(浏览器环境) | 'abstract'(node 环境)
   option:
   'history': 依赖 html5 的 HistoryAPI 和服务器配置
   'hash': 使用 URL 的 hash 值来作路由
   'abstract': 支持所有的 js 运行环境
2. base
   default: '/'
   应用的基路径
3. linkActiveClass 同上 router-link
4. linkExactActiveClass 同上 router-link
5. scrollBehavior
   type: function
   ** 这个功能只在支持 history.pushstate 的浏览器中使用 **
   ```js
   const router = new VueRouter({
     routes: [...],
     scrollbarBehavior(to, from, savedPosition) {
       // return 期望滚动到那个位置
     }
   })
   ```
   - params
     - savedPosition 当且仅当 popstate 导航时才可用, 即通过浏览器前进/后退按钮时
     - return
       返回 falsy 时则不会发生滚动行为;
       e.g.: return {x: 0, y: 0}
       e.g.: return {x: 0, y: 0}

```js
// 按下前进后退按钮时
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
// 模拟滚动到锚点
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
    }
  }
}
// 异步滚动
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

6. parseQuery/stringifyQuery
   type: function
   提供自定义查询字符串的解析/反解析函数
7. fallback
   type: boolean
   当浏览器不支持 history.pushstate 控制路由是否回退到 hash 模式

### Router 实例

- 属性
  1. router.app
     type: Vue instance
     配置了 Router 的 Vue 根实例
  2. router.mode
     type: string
     使用路由的模式
  3. router.currentRoute
     type: route
     当前路由对象
- 方法

  1. router.beforeEach

  ```js
  router.beforeEach((to, from, next) => {
    /* must call `next` */
  })
  ```

  2. router.beforeResolve

  ```js
  router.beforeResolve((to, from, next) => {
    /* must call `next` */
  })
  ```

  3. router.afterEach

  ```js
  router.afterEach((to, from, next) => {})
  ```

  **导航守卫**: 通过跳转或取消的方式来守卫导航, 可以是全局的、单个路由独享的、组件级的等等

  4. router.push(location, onComplete?, onAbort?)

  5. router.replace(location, onComplete?, onAbort?)

  6. router.go(n)

  7. router.back

  8. router.forward

  9. getMatchedComponents

  10. resolve

  11. addRoutes

  12. onReady

  13. onError

### 路由对象属性

1. \$route.path [type:string] 对应当前路由的路径, 总是解析为绝对路径
2. \$route.params [type:object] 参数, 未设置则为空
3. \$route.query [type:object] 表示 url 查询参数

```js
'/foo?id=1'
 <!-- 相当于 -->
 $route.query.id
```

4. \$route.hash [type:string] 当前路由的 hash 值, 如果没有则为空
5. \$route.fullPath [type:string] 完成解析后的 URL, 包括查询参数和 hash 的完整路径
6. \$route.matched [type:Array<RouteRecord>] 一个数组，包含当前路由的所有嵌套路径片段的路由记录
7. \$route.name
8. \$route.redirectedFrom 如果存在重定向，即为重定向来源的路由的名字

### 组件注入

- 注入的属性
  1. this.\$router
  2. this.\$route
- 增加的组件配置选项
  1. beforeRouterEnter
  2. beforeRouterUpdate
  3. beforeRouterLeave
