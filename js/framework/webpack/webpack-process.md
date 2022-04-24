# webpack 打包流程

- 用yargs进行参数解析
  - webpack.config.js
  - shell options 
    上面两步解析并合并webpack.config.js和shell options 配置项, 激活webpack插件的加载
- webpack初始化 compiler = webpack(options); => 发射事件 => WebpackOptionsApply: entyOption
  - 根据配置项options初始化Compiler对象
  - 注册NodeEnvironmentPlugin插件
  - 挂在options中的plugin插件
  - 使用WebppackOptionsApply初始化基础插件
- run(开始编译) => 发射事件 => beforeRun, beforeCompiler, compiler, thisCompilation, compilation
  - 调用compiler开启编译
  - 创建compilation对象
    - 负责整个编译过程
    - 内部保留对compiler的引用 - this.compiler
    - this.entries入口
    - this.modules所有模块
    - this.chunks代码块
    - this.assets所有资源
    - template
      - this.mainTemplate
      - this.chunkTemplate
      - this.hotUpdateChunkTemplate
      - this.runtimeTemplate
      - this.moduleTemplate
- make (分析入口文件)
- compilation.addEntry
- _addModuleChain
- buildModule
- module.build(build NormalModule)
- 递归处理依赖的模块
- compilation:seal
- this.createChunkAssets()
- template.getRenderManifest.render()
- emitAssets

1. make事件触发SingleEntryPlugin插件执行
2. 根据入口文件通过对应的工厂方法创建模块, 保存到Compilation上
3. 对module进行build
   1. 调用loader进行处理runloaders
   2. 使用acorn生成AST, 遍历AST
   3. 如果遇到require依赖, 创建dependency加入依赖数组
   4. module处理完毕都处理依赖的module
   5. 异步对依赖的模块进行处理build, 如果依赖还有依赖, 则进行递归处理
