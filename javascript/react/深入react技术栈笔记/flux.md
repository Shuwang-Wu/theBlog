# Flux

Flux 的核心思想就是数据和逻辑永远单向流动

## Flux 的基本概念

一个 Flux 应用由 3 大部分组成——dispatcher、store 和 view
dispatcher 负责分发事件；
store 负责保存数据，同时响应事件并更新数据；
view 负责订阅 store 中的数据，并使用这些数据渲染相应的页面

1. dispatcher 和 action
   dispatcher 是 Flux 中最核心的概念
   事实上，dispatcher 的实现非常简单，我们只需要关心 .register(callback) 和 .dispatch(action) 这两个 API 即可
   action 是一个普通的 JavaScript 对象，一般包含 type、payload 等字段，用于描述一个事件以及需要改变的相关数据
2. store
3. controller-view
