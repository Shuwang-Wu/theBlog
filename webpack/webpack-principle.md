<!--
 * @Description  : webpack 工作原理
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-10 09:41:49
 * @LastEditTime : 2020-07-15 15:59:24
 * @FilePath     : \notes\webpack\webpack-principle.md
-->

# webpack 工作原理

## 工作原理概括

- Entry
  入口, Webpack 执行构建的第一步将从 Entry 开始, 可抽象成输入
- Module
  模块, 在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
- Chunk
  代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割。
- Loader
  模块转换器，用于把模块原内容按照需求转换成新内容
- Plugin

### 基本概念

### 流程概括

### 流程细节

### 初始化阶段

### 编译阶段

### 输出阶段

## 输出文件分析

### bundle.js 结构分析

```js
(function(modules) {
  // 已经加载的模块
  var installedModules = [];
  function __webpack_require__(moduleId) {
    // 如果需要加载的模块已经被加载过，就直接从内存缓存中返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // 如果缓存中不存在需要加载的模块，就新建一个模块，并把它存在缓存中
    var module = (installedModules[moduleId] = {
      // 模块在数组中的 index
      i: moduleId,
      // 该模块是否已经加载完毕
      l: false,
      // 该模块的导出值
      exports: {}
    });

    // 从 modules 中获取 index 为 moduleId 的模块对应的函数
    // 再调用这个函数，同时把函数需要的参数传入
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    // 把这个模块标记为已加载
    module.l = true;
    // 返回这个模块的导出值
    return module.exports;
  }

  // Webpack 配置中的 publicPath，用于加载被分割出去的异步代码
  __webpack_require__.p = "";

  return __webpack_require__((__webpack_require__.s = 0));
})(
  // 所有模块都存放到这个数组中
  [
    /* 0 */
    function(module, exports, __webpack_require__) {
      // 通过 __webpack_require__ 规范导入 show 函数，show.js 对应的模块 index 为 1
      const show = __webpack_require__(1);
      // 执行 show 函数
      show("Webpack");
    },
    /* 1 */
    function(module, exports) {
      function show(content) {
        window.document.getElementById("app").innerText = "Hello," + content;
      }
      // 通过 CommonJS 规范导出 show 函数
      module.exports = show;
    }
  ]
);
```

### 进行代码分割时的输出

> 会输出两个文件, 分别是 bundle.js , 0.chunck.js

```js
```

## Loader

### Loader 职责

一个 Loader 的职责是单一的，只需要完成一种转换。 如果一个源文件需要经历多步转换才能正常使用，就通过多个 Loader 去转换。 在调用多个 Loader 去转换一个文件时，每个 Loader 会链式的顺序执行， 第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果会传给下一个接着处理，最后的 Loader 将处理后的最终结果返回给 Webpack

### Loader 基础

```js
// 一个最简单的 Loader 的源码如下：
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
  return source;
};
// 由于 Loader 运行在 Node.js 中，你可以调用任何 Node.js 自带的 API，或者安装第三方模块进行调用：
const sass = require("node-sass");
module.exports = function(source) {
  return sass(source);
};
```

### Loader 进阶

### Loader 职责

### 常用 Loader

1. raw-loader
   把文本文件的内容加载到代码中去
2. file-loader
   把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件
3. url-loader
   和 file-loader 类似, 但是能在文件很小的情况下将文件转化成 base64
4. source-map-loader
   加载额外的 source-map, 方便调试
5. svg-inline-loader
   把压缩后的 svg 注入到代码中
6. node-loader
   加载 Node.js 原生模块 .node 文件。
7. image-loader
   加载并且压缩图片文件。
8. json-loader
   加载 JSON 文件。
9. yaml-loader
   加载 YAML 文件

## plugin

### 基础

```js
class BasicPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    compiler.plugin("compilation", function(compilation) {});
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

- Compiler
  Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例
- Compilation
  Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。
- 区别
  Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

```js
class Plugin {
  apply(compiler) {
    compiler.plugin("emit", function(compilation, callback) {
      // compilation.chunks 存放所有代码块，是一个数组
      compilation.chunks.forEach(function(chunk) {
        // chunk 代表一个代码块
        // 代码块由多个模块组成，通过 chunk.forEachModule 能读取组成代码块的每个模块
        chunk.forEachModule(function(module) {
          // module 代表一个模块
          // module.fileDependencies 存放当前模块的所有依赖的文件路径，是一个数组
          module.fileDependencies.forEach(function(filepath) {});
        });

        // Webpack 会根据 Chunk 去生成输出的文件资源，每个 Chunk 都对应一个及其以上的输出文件
        // 例如在 Chunk 中包含了 CSS 模块并且使用了 ExtractTextPlugin 时，
        // 该 Chunk 就会生成 .js 和 .css 两个文件
        chunk.files.forEach(function(filename) {
          // compilation.assets 存放当前所有即将输出的资源
          // 调用一个输出资源的 source() 方法能获取到输出资源的内容
          let source = compilation.assets[filename].source();
        });
      });

      // 这是一个异步事件，要记得调用 callback 通知 Webpack 本次事件监听处理结束。
      // 如果忘记了调用 callback，Webpack 将一直卡在这里而不会往后执行。
      callback();
    });
  }
}
```
