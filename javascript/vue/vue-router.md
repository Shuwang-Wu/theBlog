<!--
 * @Description: xxx
 * @Author: Shuwng_Wu
 * @Github: https://github.com/shaonianruntu
 * @Date: 2022-03-07 11:11:52
 * @LastEditTime: 2022-03-07 16:35:49
-->
# Vue router 钩子函数整理

## 全局钩子函数
1. beforeEach
2. beforeResolve
3. afterEach

## 组件内钩子函数
1. beforeRouteUpdate
2. beforeRouteEnter
3. afterRouteLeave

## 完整的导航解析流程

1. 导航被触发
2. 在失活的组件里调用 beforeRouteLeave 守卫
3. 调用全局的 beforeEach 守卫
4. 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)
5. 在路由配置里调用 beforeEnter
6. 解析异步路由组件
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。




