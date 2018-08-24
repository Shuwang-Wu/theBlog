# webpack 流程
- shell 与 config 解析
  - 每次在命令行输入webpack之后，操作系统都会去调用./node_modules/.bin/webpack这个shell脚本，
  - 这个脚本会去调用 ./node_modules/webpack/bin/webpack.js， 并追加输入的参数 -p -w
  - 在webpack这个文件中 webpack 通过 optimist 将用户配置的 webpack.config.js 和shell脚本传过来的参数整合成options对象，传到下一个流程的控制对象中
  - optimist 和 commander一样，实现了node命令行的解析
  - config合并和插件加载 
  > 在加载插件之前，webpack将 webpack.config.js中的各个配置项拷贝到options对象中，并加载用户配置项中的plugins.接着optimist， 插件对象一初始化完成，options也传到到了下一个流程中
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
    > compiler.run()执行之后首先会构建出compilation对象，这个对象有两个作用，一是负责打包和构建过程，包含了每个构建环节