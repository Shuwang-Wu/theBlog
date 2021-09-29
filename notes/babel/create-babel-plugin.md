<!--
 * @Author: shuwang_wu
 * @Date: 2021-09-27 16:47:27
 * @LastEditTime: 2021-09-29 20:24:22
 * @LastEditors: shuwang_wu
 * @Description: 编写babel插件
 * @FilePath: \notes\notes\babel\create-babel-plugin.md
-->

# 如何编写 babel 插件

## 基本概念

### Babel 是什么？

Babel 是一个 JavaScript 编译器（当前最新版本 7.15）

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

1. 语法转换
2. 通过 Polyfill 方式在目标环境中添加缺失的特性（通过第三方 polyfill 模块，例如 core-js，实现）
3. 源码转换 (codemods)
4. 等等...

### babel plugin 和 babel preset 是什么？

babel 中有很多概念，比如：插件(plugin)，预设(preset)和一些比较基础的工具(例如@babel/parser,@babel/traverse 等等)。
关于他们的关系，可以理解为:

1. babel 的 plugin 构建在基础工具之上
2. babel 的 preset 是多个 babel plugin 的打包集合，例如我们所熟悉的@babel/preset-env,@babel/preset-react。

### babel 是如何转译代码的？

1. parse：code => ast
2. transform：ast => 修改过的 ast
3. generate：修改过的 ast => 编译后的 code

这三步分别对应 babel 的三个基本工具，第一步对应@babel/parser，第二步对应@babel/traverse，第三步对应@babel/generator。下面就来详述一下这三个过程。

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

## 工作详解

### @babel/parser

#### 介绍 AST

##### 例子

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

##### 常见类型

1. FunctionDeclaration（函数声明）

   ```js
   function a() {}
   ```

2. FunctionExpression（函数表达式）

   ```js
   var a = function () {}
   ```

3. ArrowFunctionExpression（箭头函数表达式）

   ```js

   ()=>{}(此处可以思考：为什么没有箭头函数声明，以及 Declaration 和 Expression 的区别)
   ```

4. AwaitExpression（await 表达式）

   ```js
   async function a() {
     await b()
   }
   ```

5. CallExpression（调用表达式）

   ```js
   a()
   ```

6. MemberExpression（成员表达式）

   ```js
   a.b
   ```

7. VariableDeclarator（变量声明）

   ```js

     var,const,let(var,const,let 用 Node 中的 kind 区分)
   ```

8. Identifier（变量标识符）

   ```js

   var a(这里 a 是一个 Identifier)
   ```

9. NumericLiteral（数字字面量）

   ```js
   var a = 1
   ```

10. StringLiteral（字符串字面量）

    ```js
    var a = "a"
    ```

11. BooleanLiteral（布尔值字面量）

    ```js
    var a = true
    ```

12. NullLiteral（null 字面量）

    ```js

    var a = null(此处可以思考：为什么没有 undefined 字面量)
    ```

13. BlockStatement（块）

    ```js
    {
    }
    ```

14. ArrayExpression（数组表达式）

    ````js
    []
        ```

    ````

15. ObjectExpression（对象表达式）

    ````js
    var a = {}

        ```
    ````

16. SpreadElement（扩展运算符）

    ````js
    {...a},[...a]
        ```
    ````

17. ObjectProperty（对象属性）

    ```js

    {a:1}(这里的 a:1 是一个 ObjectProperty)
    ```

18. ObjectMethod（函数属性）

    ```js
    {a(){}}
    ```

19. ExpressionStatement（表达式语句）

    ```js
    a()
    ```

20. IfStatement（if）

    ```js
    if () {}
    ```

21. ForStatement（for）

    ```js
    for (;;) {}
    ```

22. ForInStatement（for in）

    ```js
    for (a in b) {
    }
    ```

23. ForOfStatement（for of）

    ```js
    for (a of b) {
    }
    ```

24. ImportDeclaration（import 声明）

    ```js
    import "a"
    ```

25. ImportDefaultSpecifier（import default 说明符）

    ```js
    import a from "a"
    ```

26. ImportSpecifier（import 说明符）

    ```js
    import { a } from "a"
    ```

27. NewExpression（new 表达式）

    ```js
    new A()
    ```

28. ClassDeclaration（class 声明）

    ```js
    class A {}
    ```

29. ClassBody（class body）类的内部

    ```js
    class A {}
    ```

**[点击此处查看对应类型](https://babeljs.io/docs/en/babel-types)**

### transform(@babel/traverse,@babel/types,@babel/template)

插件的最基本的结构

```js
  module.exports = (babel) => {
    return {
        visitor: {
            ...
        }
    }
  };
```

#### 关于 visitor

1. 访问者

   是一个用于 AST 遍历的跨语言的模式。 简单的说它们就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。

   ```js
   // babel会使用他的递归遍历器去遍历整棵ast，在进入和退出Identifier节点时，会执行我们定义的函数
   const visitor = {
     // 可以把方法名用|分割成a节点类型|b节点类型形式的字符串，把同一个函数应用到多种访问节点
     // 'FunctionExpression|ArrowFunctionExpression' () {
     //    console.log('A function expression or a arrow function expression!')
     // }
   Identifier () {
     enter () {
       console.log('Hello Identifier!')
     },
     // 一般情况下exit较少使用, 可省略
     exit () {
       console.log('Bye Identifier!')
     }
   }
   }
   ```

2. 简单示例

   ```js
   const parser = require("@babel/parser")
   const traverse = require("@babel/traverse").default

   const code = `function mirror(something) {
     return something
   }`
   const ast = parser.parse(code, {
     sourceType: "module"
   })
   const visitor = {
     Identifier(path) {
       console.log(path.node.name) // mirror,something,something
     }
   }
   traverse(ast, visitor)
   ```

#### 关于 path

对当前访问的 node 的一层包装。例如使用 path.node 可以访问到当前的节点，使用 path.parent 可以访问到父节点，下面列出了 path 所包含的内容

1. [常见参数(点击查看)](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)

   ```json
   {
     "parent": {...},
     "node": {...},
     "hub": {...},
     "contexts": [],
     "data": {},
     "shouldSkip": false,
     "shouldStop": false,
     "removed": false,
     "state": null,
     "opts": null,
     "skipKeys": null,
     "parentPath": null,
     "context": null,
     "container": null,
     "listKey": null,
     "inList": false,
     "parentKey": null,
     "key": null,
     "scope": null,
     "type": null,
     "typeAnnotation": null
   }
   ```

#### 完整转换例子

```js
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default

const code = `function mirror(something) {
  return something
}`
const ast = parser.parse(code, {
  sourceType: "module"
})
const visitor = {
  Identifier(path) {
    path.node.name = path.node.name.split("").reverse().join("") // 反转名称
  }
}
traverse(ast, visitor)
const transformedCode = generate(ast).code
console.log(transformedCode)
```

```js
function rorrim(gnihtemos) {
  return gnihtemos
}
```

### generate(@babel/generator)

1. 安装依赖

   ```bush
   yarn add @babel/parser @babel/generator
   ```

2. 相关代码

   ```js
   const parser = require("@babel/parser")
   const generate = require("@babel/generator").default

   const code = `function mirror(something) {
     return something
   }`
   const ast = parser.parse(code, {
     sourceType: "module"
   })
   const transformedCode = generate(ast).code
   console.log(transformedCode)
   ```

3. 运行结果

   ```js
   function mirror(something) {
     return something
   }
   ```

**[详细语法参考官网](https://babeljs.io/docs/en/babel-generator)**

### @babel/types

Babel Types 模块是一个用于 AST 节点的工具库， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用

1. 判断节点的类型

   ```js
   const parser = require("@babel/parser")
   const traverse = require("@babel/traverse").default
   const t = require("@babel/types")

   const code = `function mirror(something) {
        return something
      }`
   const ast = parser.parse(code, {
     sourceType: "module"
   })
   const visitor = {
     enter(path) {
       if (t.isIdentifier(path.node)) {
         console.log("Identifier!")
       }
     }
   }
   traverse(ast, visitor)
   // log: Identifier! Identifier! Identifier!
   ```

2. 生成节点

   ```js
   const parser = require("@babel/parser")
   const traverse = require("@babel/traverse").default
   const generate = require("@babel/generator").default
   const t = require("@babel/types")

   const code = `function mirror(something) { return something }`
   const ast = parser.parse(code, {
     sourceType: "module"
   })
   const strNode = t.stringLiteral("mirror")
   const visitor = {
     ReturnStatement(path) {
       path.traverse({
         Identifier(cpath) {
           cpath.replaceWith(strNode)
         }
       })
     }
   }
   traverse(ast, visitor)
   const transformedCode = generate(ast).code
   console.log(transformedCode)
   // log
   // function mirror(something) {
   // return "mirror";
   // }
   ```

### @babel/template

使用@babel/type 创建一些简单节点会很容易，但是如果是大段代码的话就会变得困难了，这个时候我们可以使用@babel/template。下面写了一个简单示例，为 mirror 函数内部写了一些逻辑判断

```js
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default
const template = require("@babel/template").default
const t = require("@babel/types")

const code = `function mirror(something) {
  return something
}`
const ast = parser.parse(code, {
  sourceType: "module"
})
const visitor = {
  FunctionDeclaration(path) {
    // 在这里声明了一个模板，比用@babel/types去生成方便很多
    const temp = template(`
      if(something) {
        NORMAL_RETURN
      } else {
        return 'nothing'
      }
    `)
    const returnNode = path.node.body.body[0]
    const tempAst = temp({
      NORMAL_RETURN: returnNode
    })
    path.node.body.body[0] = tempAst
  }
}
traverse(ast, visitor)
const transformedCode = generate(ast).code
console.log(transformedCode)

// log
// function mirror(something) {
//   if (something) {
//     return something;
//   } else {
//     return 'nothing';
//   }
// }
```

## 编写 babel 插件

### 实现代码

```js
module.exports = function (babel) {
  const { types: t, template } = babel
  const visitor = {
    FunctionDeclaration(path, state) {
      const temp = template(`
        if(something) {
          NORMAL_RETURN
        } else {
          return '${state.opts.whenFalsy}'
        }
      `)
      const returnNode = path.node.body.body[0]
      const tempAst = temp({
        NORMAL_RETURN: returnNode
      })
      path.node.body.body[0] = tempAst
    }
  }
  return {
    name: "my-plugin",
    visitor
  }
}
```

### 测试代码

```js
const babel = require("@babel/core")

const code = `function mirror(something) {
  return something
}`
const res = babel.transformSync(code, {
  plugins: [
    [
      require("你编写的插件地址"),
      {
        whenFalsy: "Nothing really."
      }
    ]
  ]
})

console.log(res.code)
```

log

```js
function mirror(something) {
  if (something) {
    return something
  } else {
    return "Nothing really."
  }
}
```
