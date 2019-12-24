# webpack 流程

- shell 与 config 解析
  - 每次在命令行输入 webpack 之后，操作系统都会去调用./node_modules/.bin/webpack 这个 shell 脚本，
  - 这个脚本会去调用 ./node_modules/webpack/bin/webpack.js， 并追加输入的参数 -p -w
  - 在 webpack 这个文件中 webpack 通过 optimist 将用户配置的 webpack.config.js 和 shell 脚本传过来的参数整合成 options 对象，传到下一个流程的控制对象中
  - optimist 和 commander 一样，实现了 node 命令行的解析
  - config 合并和插件加载
    > 在加载插件之前，webpack 将 webpack.config.js 中的各个配置项拷贝到 options 对象中，并加载用户配置项中的 plugins.接着 optimist， 插件对象一初始化完成，options 也传到到了下一个流程中
    > var webpack = require('webpack')
    > var compiler = webpack(options)
- 编译和构建流程
  - run 开始执行后, 就开始了编译和构建的流程, 其中有几个比较关键的事件节点
    - compiler
    - make
    - build module
    - after compiler
    - emit
    - seal
    - after emit
  - 核心对象 Compilation
    > compiler.run()执行之后首先会构建出 compilation 对象，这个对象有两个作用，一是负责打包和构建过程，包含了每个构建环节
