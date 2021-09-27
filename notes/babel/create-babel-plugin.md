<!--
 * @Author: shuwang_wu
 * @Date: 2021-09-27 16:47:27
 * @LastEditTime: 2021-09-27 17:27:21
 * @LastEditors: shuwang_wu
 * @Description: 编写babel插件
 * @FilePath: \notes\notes\babel\create-babel-plugin.md
-->

# 如何编写 babel 插件

## Babel 是什么？

Babel 是一个 JavaScript 编译器（当前最新版本 7.15）

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

1. 语法转换
2. 通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 core-js，实现）
3. 源码转换 (codemods)
4. 等等...

## babel 常见配置

### webpack 配置

```bush
npm install --save-dev babel-loader @babel/core
```

```js
{
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
}
```

### rollup 配置

```bush
npm install --save-dev @rollup/plugin-babel @babel/core
```

```js
import babel from "@rollup/plugin-babel"

const config = {
  input: "src/index.js",
  output: {
    dir: "output",
    format: "esm"
  },
  plugins: [babel({ babelHelpers: "bundled" })]
}

export default config
```

## 介绍 AST

```js
let str = "test"
let func = () => {}
let num = 1
let obj = {}
let bool = true
```

```json
{
  "type": "Program",
  "start": 0,
  "end": 256,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 179,
      "end": 195,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 183,
          "end": 195,
          "id": {
            "type": "Identifier",
            "start": 183,
            "end": 186,
            "name": "str"
          },
          "init": {
            "type": "Literal",
            "start": 189,
            "end": 195,
            "value": "test",
            "raw": "'test'"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 196,
      "end": 215,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 200,
          "end": 215,
          "id": {
            "type": "Identifier",
            "start": 200,
            "end": 204,
            "name": "func"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "start": 207,
            "end": 215,
            "id": null,
            "expression": false,
            "generator": false,
            "async": false,
            "params": [],
            "body": {
              "type": "BlockStatement",
              "start": 213,
              "end": 215,
              "body": []
            }
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 216,
      "end": 227,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 220,
          "end": 227,
          "id": {
            "type": "Identifier",
            "start": 220,
            "end": 223,
            "name": "num"
          },
          "init": {
            "type": "Literal",
            "start": 226,
            "end": 227,
            "value": 1,
            "raw": "1"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 228,
      "end": 240,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 232,
          "end": 240,
          "id": {
            "type": "Identifier",
            "start": 232,
            "end": 235,
            "name": "obj"
          },
          "init": {
            "type": "ObjectExpression",
            "start": 238,
            "end": 240,
            "properties": []
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "VariableDeclaration",
      "start": 241,
      "end": 256,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 245,
          "end": 256,
          "id": {
            "type": "Identifier",
            "start": 245,
            "end": 249,
            "name": "bool"
          },
          "init": {
            "type": "Literal",
            "start": 252,
            "end": 256,
            "value": true,
            "raw": "true"
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "module"
}
```
