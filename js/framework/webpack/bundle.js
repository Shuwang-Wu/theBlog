/**
 * @Description  : webpack打包之后的文件
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-13 12:02:33
 * @LastEditTime : 2020-07-13 12:02:49
 * @FilePath     : \notes\webpack\bundle.js
 */

// webpackBootstrap 启动函数
// modules 即为存放所有模块的数组，数组中的每一个元素都是一个函数
(function(modules) {
  // 安装过的模块都存放在这里面
  // 作用是把已经加载过的模块缓存在内存中，提升性能
  var installedModules = {};

  // 去数组中加载一个模块，moduleId 为要加载模块在数组中的 index
  // 作用和 Node.js 中 require 语句相似
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

  // 使用 __webpack_require__ 去加载 index 为 0 的模块，并且返回该模块导出的内容
  // index 为 0 的模块就是 main.js 对应的文件，也就是执行入口模块
  // __webpack_require__.s 的含义是启动模块对应的 index
  return __webpack_require__((__webpack_require__.s = 0));
})(
  // 所有的模块都存放在了一个数组里，根据每个模块在数组的 index 来区分和定位模块
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
