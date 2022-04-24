# Code Style

## 理由

代码的可维护性提高, 减少代码中的错误, 保持前端团队代码的一致性

## 准备工作

全局安装

```js
npm install eslint -g
npm install prettier -g
```

## Eslint

linting is process of running a program that will analyse code for potential errors

### 插件介绍

1. babel-eslint
   这个包让你可以轻松在 Babel 上使用 lint。如果你不使用 ESLint 尚不支持的 Flow 或实验性功能，则不一定需要这个插件。

2. eslint
   这是 lint 代码所需的主要工具。

3. eslint-config-airbnb
   这个包提供了所有 Airbnb 的 ESLint 配置，你可以修改它们。

4. eslint-plugin-babel
   babel-eslint 的插件伴侣。

5. eslint-plugin-import
   这个插件旨在支持 ES2015+（ES6+）的导入 / 导出语法，并防止出现拼写错误的文件路径和导入名称。

6. eslint-plugin-jsx-a11y
   适用于 JSX 元素可访问性规则的 linting 规则。

7. eslint-plugin-prettier
   让 ESLint 与 Prettier 的使用更顺畅。

8. eslint-plugin-react
   特定于 React 的 linting 规则。

9. eslint-config-jest-enzyme
   用于特定于 React 和 Enzyme 的全局变量。这个 lint 配置让 ESLint 知道有哪些全局变量，并且不会针对它们发出警告——有点像断言 it 和 describe。

10. eslint-plugin-jest
    Jest 的 ESLint 插件。

11. husky
    在自动化部分会进行更多介绍。

12. lint-staged
    在自动化部分会进行更多介绍。

### .eslintrc.js 配置详解

1. 规则控制

"off"或者 0 //关闭规则关闭
"warn"或者 1 //在打开的规则作为警告（不影响退出代码）
"error"或者 2 //把规则作为一个错误（退出代码触发时为 1）

```js
"rules": {
    "indent": [2, 2], // 控制缩进为2
    "eqeqeq": 1,// 警告使用全等
    "quotes": [2, "single"], //单引号
    "no-console": 0, //不禁用console
    "no-debugger": 1, //禁用debugger
    "no-var": 2, //对var警告
    "semi": 2, //强制使用分号
    "semi-spacing": [2, {"before": false, "after": true}], // 强制分号前后不允许空格
    "no-irregular-whitespace": 0, //不规则的空白不允许
    "no-trailing-spaces": 1, //一行结束后面有空格就发出警告
    "eol-last": 0, //文件以单一的换行符结束
    "no-unused-vars": [2, {"vars": "all", "args": "after-used"}], //不能有声明后未被使用的变量或参数
    "no-underscore-dangle": 0, //标识符不能以_开头或结尾
    "no-alert": 2, //禁止使用alert confirm prompt
    "no-lone-blocks": 0, //禁止不必要的嵌套块
    "no-class-assign": 2, //禁止给类赋值
    "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-delete-var": 2, //不能对var声明的变量使用delete操作符
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-dupe-args": 2, //函数参数不能重复
    "no-empty": 2, //块语句中的内容不能为空
    "no-func-assign": 2, //禁止重复的函数声明
    "no-invalid-this": 0, //禁止无效的this，只能用在构造器，类，对象字面量
    "no-redeclare": 2, //禁止重复声明变量
    "no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
    "no-this-before-super": 0, //在调用super()之前不能使用this或super
    "no-undef": 2, //不能有未定义的变量
    "no-use-before-define": 2, //未定义前不能使用
    "camelcase": 0, //强制驼峰法命名
    "jsx-quotes": [2, "prefer-double"], //强制在JSX属性（jsx-quotes）中一致使用双引号
    "react/display-name": 0, //防止在React组件定义中丢失displayName
    "react/forbid-prop-types": [2, {"forbid": ["any"]}], //禁止某些propTypes
    "react/jsx-boolean-value": 2, //在JSX中强制布尔属性符号
    "react/jsx-closing-bracket-location": 1, //在JSX中验证右括号位置
    "react/jsx-curly-spacing": [2, {"when": "never", "children": true}], //在JSX属性和表达式中加强或禁止大括号内的空格。
    "react/jsx-indent": [2,2], // 语法缩进控制
    "react/jsx-indent-props": [2, 2], //验证JSX中的props缩进是否为2个
    "react/jsx-key": 2, //在数组或迭代器中验证JSX具有key属性
    "react/jsx-max-props-per-line": [1, {"maximum": 1}], // 限制JSX中单行上的props的最大数量
    "react/jsx-no-bind": 0, //JSX中不允许使用箭头函数和bind
    "react/jsx-no-duplicate-props": 2, //防止在JSX中重复的props
    "react/jsx-no-literals": 0, //防止使用未包装的JSX字符串
    "react/jsx-no-undef": 1, //在JSX中禁止未声明的变量
    "react/jsx-pascal-case": 0, //为用户定义的JSX组件强制使用PascalCase
    "react/jsx-sort-props": 2, //强化props按字母排序
    "react/jsx-uses-react": 1, //防止反应被错误地标记为未使用
    "react/jsx-uses-vars": 2, //防止在JSX中使用的变量被错误地标记为未使用
    "react/no-danger": 0, //防止使用危险的JSX属性
    "react/no-did-mount-set-state": 0, //防止在componentDidMount中使用setState
    "react/no-did-update-set-state": 1, //防止在componentDidUpdate中使用setState
    "react/no-direct-mutation-state": 2, //防止this.state的直接变异
    "react/no-multi-comp": 2, //防止每个文件有多个组件定义
    "react/no-set-state": 0, //防止使用setState
    "react/no-unknown-property": 2, //防止使用未知的DOM属性
    "react/prefer-es6-class": 2, //为React组件强制执行ES5或ES6类
    "react/prop-types": 0, //防止在React组件定义中丢失props验证
    "react/react-in-jsx-scope": 2, //使用JSX时防止丢失React
    "react/self-closing-comp": 0, //防止没有children的组件的额外结束标签
    "react/sort-comp": 2, //强制组件方法顺序
    "no-extra-boolean-cast": 0, //禁止不必要的bool转换
    "react/no-array-index-key": 0, //防止在数组中遍历中使用数组key做索引
    "react/no-deprecated": 1, //不使用弃用的方法
    "react/jsx-equals-spacing": 2, //在JSX属性中强制或禁止等号周围的空格
    "no-unreachable": 1, //不能有无法执行的代码
    "comma-dangle": ["error", "always"], //对象字面量项尾必须有逗号
    "no-mixed-spaces-and-tabs": 0, //禁止混用tab和空格
    "prefer-arrow-callback": 0, //比较喜欢箭头回调
    "arrow-parens": 0, //箭头函数用小括号括起来
    "arrow-spacing": 0, //=>的前/后括号
    "prefer-const": ["error", {
      "destructuring": "all"
    }],
    "prefer-destructuring": ["error", {
      "VariableDeclarator": {
        "array": false,
        "object": true
      },
      "AssignmentExpression": {
        "array": false,
        "object": false
      }
    }, {
      "enforceForRenamedProperties": false
    }],
    "use-isnan": 2,//禁止比较时使用NaN，只能用isNaN()
  },
  "settings": {
    "import/ignore": [
      "node_modules"
    ]
  }
```

## Prettier

### Linters hava two categories of rules:

1. Formatting rules:
   eg: max-len, no-mixed-spaces-tabs, keyword-spacing, comma-style...
   Prettier alleviates the need for this whole category of rules!
   Prettier is going to reprint the entire program from scratch in a consistent way, so it`s not possible for the programmer to make a misstake there anymore
2. Code-quality rules:
   eg: no-unused-vars, no-extra-binds, no-implicit-globals, prefer-promise-reject-errors...
   Prettier doing nothing to help with those kind of rules, they are also the most important ones provided by linters as they are likely to catch real bugs with your code!

## Editor

### VScode

1. 插件安装

- Prettier - Code Formatter
- ESLint

2. 针对配置
   setting.json 文件
   // 如果保存的时候使用 eslint --fix 自动修复当前文件的话, 将其设置为 true
   "eslint.autoFixOnSave": false,
   // 如果保存的时候使用 prettier 自动修复的话, 将其设置为 true
   "editor.formatOnSave": true,
   "[javascript]": {
   "editor.tabSize": 2
   },
   主要不用同时将 eslint.autoFixOnSave 和 editor.formatOnSave 设置为 true, 会产生冲突

## git

husky 是一个 Git 钩子，你可以在提交代码前或在将代码推送到分支时执行某些特定的操作。

1. 安装 husky

```js
$ yarn add --dev husky
```

```json
{
  ...,
  // package.json 中添加如下配置
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "YOUR_COMMAND_HERE"
    }
  }
  ...,
}
```

每次在提交或推送代码时，它都会执行某个脚本或命令——比如运行测试用例或格式化代码。

2. lint-staged

```js
// <!-- 安装 lint-staged -->
 $ yarn add --dev lint-staged
```

package.json 配置

```json
{
  ...,
  // package.json 中添加如下配置
  "lint-staged": {
    "*.(js|jsx)": ["npm run lint:write", "git add"]
  }
  ...
}
```

这段配置的意思是先运行 lint:write 命令，然后将文件添加到暂存区域。它仅针对.js 和.jsx 文件运行这个命令，但你也可以根据需要针对其他文件运行这个命令。
每当你提交代码时：
$ git add .
$ git commit -m "代码被 commit 之前都会执行 lint-staged 命令"
它将根据.eslintrc.js 文件的所有规则对代码进行 lint 和格式化。有了这个，你就可以确保没有坏代码被推到生产环境中。

## demo

1. package.json 的配置情况

```json
{
  "name": "eslint-prettier-editorconfig-learn",
  "version": "1.0.0",
  "description": "eslint prettier editorconfig",
  "main": "index.js",
  "scripts": {
    "lint": "eslint --debug src/",
    "lint:write": "eslint --debug src/ --fix",
    "prettier": "prettier --write src/**/*.js"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.(js|jsx)": ["npm run lint:write", "git add"]
  },
  "author": "VonConfidence",
  "license": "ISC",
  "devDependencies": {
    "babel-eslint": "^8.2.3",
    "eslint": "^4.19.1",
    "eslint-config-airbnb": "^17.0.0",
    "eslint-config-jest-enzyme": "^6.0.2",
    "eslint-plugin-babel": "^5.1.0",
    "eslint-plugin-import": "^2.12.0",
    "eslint-plugin-jest": "^21.18.0",
    "eslint-plugin-jsx-a11y": "^6.0.3",
    "eslint-plugin-prettier": "^2.6.0",
    "eslint-plugin-react": "^7.9.1",
    "husky": "1.3.1",
    "lint-staged": "8.1.0",
    "prettier": "1.15.3"
  }
}
```

2. .editorconfig 文件

```yml
# EditorConfig is awesome: http://EditorConfig.org

 # top-most EditorConfig file
 root = true

 [*.md]
 trim_trailing_whitespace = false

 [*.js]
 trim_trailing_whitespace = true

 # Unix-style newlines with a newline ending every file
 [*]
 indent_style = space # 将缩进样式设置为空格而不是制表符；
 indent_size = 2 # 缩进大小为 2；
 end_of_line = lf # 行尾是 lf，这样不管使用的是哪种操作系统，都会有相同的行尾；
 charset = utf-8
 insert_final_newline = true # 文件末尾应该有一个新行；
 max_line_length = 120 # 单行的最大度应为 120 个字符。
```

3. .eslintrc.js 最终形式

```js
module.exports = {
  // 用于预定义全局变量
  env: {
    es6: true, // 启动es6全局变量
    browser: true, // 浏览器全局变量window, document等
    node: true // 启用node全局变量global等
  },
  // 扩展了之面配置的额外配置选项。
  // 现在我们正在使用 airbnb 的 linting 规则，这些规则被扩展到 jest，然后是 jest-enzyme。
  extends: ["airbnb", "plugin:jest/recommended", "jest-enzyme"],
  // 插件基本上就是我们想要使用的 linting 规则
  plugins: ["babel", "import", "jsx-a11y", "react", "prettier"],
  // 默认情况下，ESLint 使用 Espree，但因为我们使用了 babel，我们还需要使用 Babel-ESLint
  parser: "babel-eslint",
  // 如果我们将 Espree 的默认解析器更改为 babel-eslint，需要指定 parserOptions
  /*
   告诉 ESLint，ecmaVersion 是 6。
   因为我们在 EcmaScript 模块（而不是 script）中编写代码，所以我们将 sourceType 指定为 module。
   由于我们使用了 React，引入了 JSX，所以在 ecmaFeatures 中加了 jsx 选项，并将其设置为 true。
   */
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  // 更改或覆盖添加的规则 off warn error
  rules: {
    "linebreak-style": "off", // Don't play nicely with Windows.
    "arrow-parens": "off", // Incompatible with prettier
    "object-curly-newline": "off", // Incompatible with prettier
    "no-mixed-operators": "off", // Incompatible with prettier
    "arrow-body-style": "off", // Not our taste?
    "function-paren-newline": "off", // Incompatible with prettier
    "no-plusplus": "off",
    "space-before-function-paren": 0, // Incompatible with prettier
    "max-len": ["error", 100, 2, { ignoreUrls: true }], // airbnb is allowing some edge cases
    "no-console": "warn", // airbnb is using warn
    "no-alert": "warn", // airbnb is using warn
    "no-param-reassign": "off", // Not our taste?
    radix: "off", // parseInt, parseFloat radix turned off. Not my taste.
    "react/require-default-props": "off", // airbnb use error
    "react/forbid-prop-types": "off", // airbnb use error
    "react/jsx-filename-extension": ["error", { extensions: [".js"] }], // airbnb is using .jsx
    "prefer-destructuring": "off",
    "react/no-find-dom-node": "off", // I don't know
    "react/no-did-mount-set-state": "off",
    "react/no-unused-prop-types": "off", // Is still buggy
    "react/jsx-one-expression-per-line": "off",

    "jsx-a11y/anchor-is-valid": ["error", { components: ["Link"], specialLink: ["to"] }],
    "jsx-a11y/label-has-for": [
      2,
      {
        required: {
          every: ["id"]
        }
      }
    ], // for nested label htmlFor error

    "prettier/prettier": ["error"]
  }
};
```

## 问题收集

1. don`t use new for side effect

```json
// 在json里面添加
rules: {
    "no-new": 0
}
```

2. Replace `'object'` with `"object"`
