# 简易版vue
- 目录结构
  - observe 监听器
  - compile 编译器
  - watcher 订阅器
  - index 实现对数据的监听, 订阅, 编译vue指令
- 思路
  - observe
    - 通过Object.defineProperty()来实现对数据的劫持
      > 劫持并监听data属性, 通过Object.defineProperty()来对data属性进行改写, 在其中还要添加订阅器来对数据的改变进行订阅操作
    - 创建Dep对象
      > 创建订阅器, 其中subs用来保存订阅者, 并在原型中定义了addSub, notify两个方法
      - addSub
        > 在监听数据的时候添加到subs里面
      - notify 
        > 当数据发生改变的时候通过notify通知更新
  - compile
    - el 传入将要挂载到Dom树的html标签
    - vm 传入新建的SelfVue实例 
    - @method init 初始化编译
      - 判断将要挂载的元素是否存在
      - 如果存在，则新建代码片段
      - 编译vue模版文件，包括其中的模版变量、指令等
      - 编译完成，挂载带指定DOM节点
    - @method nodeToElement 初始化编译
      > 将获取到的真是DOM节点添加到新建的代码片段, 节约dom操作带来的成本
    - @method compile 编译模版文件, 针对不同的元素节点采用不同的编译方法
      > 根据不同类型的节点来选择不同的编译方式
    - @method compileElement 编译Dom元素
    - @method compileModel 编译v-model指令
    - @method compileText 编译文本节点
    - @method compileEvent 编译v-bind指令绑定的方法
    - @method modelUpdater 渲染当前更新
    - @method updateText  判断当前文本是否为空, 并返回指定的文本
    - @method isDerective 判断是否为指令
    - @method isEventDirective 是否为事件指令
    - @method isElementNode 是否是元素节点
    - @method isTextNode 是否是文本节点
  - watcher
    - get 
      > 自身出发更新
    - upodate
      > 通知更新
    - run
      > 进行数据的更新