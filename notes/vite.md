<!--
 * @Author: Shuwang Wu
 * @Date: 2022-03-11 17:41:01
 * @LastEditTime: 2022-03-11 17:43:46
 * @LastEditors: Shuwang Wu
 * @Description: vite
 * @FilePath: \notes\notes\vite.md
-->

# Vite

## 为什么选Vite

1. 使用 esbuild 预构建依赖。Esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。
2. 以 原生 ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。