# ESlint config

ESlint + prettier + vscode 配置前端代码规范

下面是收录需要用到的 eslint 规则, 后续会持续更新
目的： 避免低级错误, 保持代码的输出一致

<!-- 下面为网上摘录 -->

```js
/*
* ESLint的JSON文件是允许JavaScript注释的，但在gist里显示效果不好，所以我把.json文件后缀改为了.js
*/

/*
* ESLint 配置文件优先级：
* .eslintrc.js(输出一个配置对象)
* .eslintrc.yaml
* .eslintrc.yml
* .eslintrc.json（ESLint的JSON文件允许JavaScript风格的注释）
* .eslintrc（可以是JSON也可以是YAML）
*  package.json（在package.json里创建一个eslintConfig属性，在那里定义你的配置）
*/

/*
* 你可以通过在项目根目录创建一个.eslintignore文件告诉ESLint去忽略特定的文件和目录
* .eslintignore文件是一个纯文本文件，其中的每一行都是一个glob模式表明哪些路径应该忽略检测
*/

{
 //ESLint默认使用Espree作为其解析器
 //同时babel-eslint也是用得最多的解析器
 "parser": "espree",

 //parser解析代码时的参数
 "parserOption": {
   //指定要使用的ECMAScript版本，默认值5
   "ecmaVersion": 5,
   //设置为script(默认)或module（如果你的代码是ECMAScript模块)
   "sourceType": "script",
   //这是个对象，表示你想使用的额外的语言特性,所有选项默认都是false
   "ecmafeatures": {
     //允许在全局作用域下使用return语句
     "globalReturn": false,
     //启用全局strict模式（严格模式）
     "impliedStrict": false,
     //启用JSX
     "jsx": false,
     //启用对实验性的objectRest/spreadProperties的支持
     "experimentalObjectRestSpread": false
   }
 },

 //指定环境，每个环境都有自己预定义的全局变量，可以同时指定多个环境，不矛盾
 "env": {
   //效果同配置项ecmaVersion一样
   "es6": true,
   "browser": true,
   "node": true,
   "commonjs": false,
   "mocha": true,
   "jquery": true,
    //如果你想使用来自某个插件的环境时，确保在plugins数组里指定插件名
    //格式为：插件名/环境名称（插件名不带前缀）
   "react/node": true
 },

 //指定环境为我们提供了预置的全局变量
 //对于那些我们自定义的全局变量，可以用globals指定
 //设置每个变量等于true允许变量被重写，或false不允许被重写
 "globals": {
   "globalVar1": true,
   "globalVar2": false
 },

 //ESLint支持使用第三方插件
 //在使用插件之前，你必须使用npm安装它
 //全局安装的ESLint只能使用全局安装的插件
 //本地安装的ESLint不仅可以使用本地安装的插件还可以使用全局安装的插件
 //plugin与extend的区别：extend提供的是eslint现有规则的一系列预设
 //而plugin则提供了除预设之外的自定义规则，当你在eslint的规则里找不到合适的的时候
 //就可以借用插件来实现了
 "plugins": [
   "eslint-plugin-airbnb",
   //插件名称可以省略eslint-plugin-前缀
   "react"
 ],

 //具体规则配置
 //off或0--关闭规则
 //warn或1--开启规则，警告级别(不会导致程序退出)
 //error或2--开启规则，错误级别(当被触发的时候，程序会退出)
 "rules": {
   "eqeqeq": "warn",
   //你也可以使用对应的数字定义规则严重程度
   "curly": 2,
   //如果某条规则有额外的选项，你可以使用数组字面量指定它们
   //选项可以是字符串，也可以是对象
   "quotes": ["error", "double"],
   "one-var": ["error", {
     "var": "always",
     "let": "never",
     "const": "never"
   }],
   //配置插件提供的自定义规则的时候，格式为：不带前缀插件名/规则ID
   "react/curly": "error"
 },

 //ESLint支持在配置文件添加共享设置
 //你可以添加settings对象到配置文件，它将提供给每一个将被执行的规则
 //如果你想添加的自定义规则而且使它们可以访问到相同的信息，这将会很有用，并且很容易配置
 "settings": {
   "sharedData": "Hello"
 },

 //Eslint检测配置文件步骤：
 //1.在要检测的文件同一目录里寻找.eslintrc.*和package.json
 //2.紧接着在父级目录里寻找，一直到文件系统的根目录
 //3.如果在前两步发现有root：true的配置，停止在父级目录中寻找.eslintrc
 //4.如果以上步骤都没有找到，则回退到用户主目录~/.eslintrc中自定义的默认配置
 "root": true,

 //extends属性值可以是一个字符串或字符串数组
 //数组中每个配置项继承它前面的配置
 //可选的配置项如下
 //1.字符串eslint：recommended，该配置项启用一系列核心规则，这些规则报告一些常见问题，即在(规则页面)中打勾的规则
 //2.一个可以输出配置对象的可共享配置包，如eslint-config-standard
   //可共享配置包是一个导出配置对象的简单的npm包，包名称以eslint-config-开头，使用前要安装
   //extends属性值可以省略包名的前缀eslint-config-
 //3.一个输出配置规则的插件包，如eslint-plugin-react
   //一些插件也可以输出一个或多个命名的配置
   //extends属性值为，plugin：包名/配置名称
 //4.一个指向配置文件的相对路径或绝对路径
 //5.字符串eslint：all，启用当前安装的ESLint中所有的核心规则
   //该配置不推荐在产品中使用，因为它随着ESLint版本进行更改。使用的话，请自己承担风险
 "extends": [
   "eslint:recommended",
   "standard",
   "plugin:react/recommended",
   "./node_modules/coding-standard/.eslintrc-es6",
   "eslint:all"
 ]
}
```

<!-- 腾讯Now直播规则 -->

```js
"use strict";

module.exports = {
  extends: ["./eslint-config-react/index.js"],
  rules: {
    /* section1 : 可能存在的错误 */
    // error; for循转方向出错
    "for-direction": 2,
    // error; getter必须有返回值，并且禁止返回值为undefined, 比如 return;
    "getter-return": [2, { allowImplicit: false }],
    // off; 不允许在循环中出现await
    "no-await-in-loop": 0,
    // off; 允许使用console进行代码调试
    "no-console": 0,
    // warn; 直接调用对象原型链上的方法
    "no-prototype-builtins": 1,
    // off; 函数注释一定要遵守jsdoc规则
    "valid-jsdoc": 0,
    // warn; 在字符串里面出现{和}进行警告
    "no-template-curly-in-string": 1,
    // warn; get和set没有成对出现时给出警告

    /* section2: 最佳实践 */
    "accessor-pairs": 1,
    // error; 对于数据相关操作函数比如reduce, map, filter等，callback必须有return
    "array-callback-return": 2,
    // error; 把var关键字看成块级作用域，防止变量提升导致的bug
    "block-scoped-var": 2,
    // off; 要求在Class里面合理使用this，如果某个方法没有使用this,则应该申明为静态方法
    "class-methods-use-this": 0,
    // off; 关闭代码复杂度限制
    complexity: 0,
    // error; switch case语句里面一定需要default分支
    "default-case": 2,
    // warn: 代码中使用了alert给出警告
    "no-alert": 1,
    // off; 不允许使用空函数，除非在空函数里面给出注释说明
    "no-empty-function": 0,
    // off; foo == null 用于判断 foo 不是 undefined 并且不是 null，比较常用，故允许此写法
    "no-eq-null": 0,
    // error; 代码中不允许使用eval
    "no-eval": 2,
    // error; 禁止修改原生对象
    "no-extend-native": 2,
    // error; 禁止出现没必要的 bind
    "no-extra-bind": 2,
    // error; 表示小数时，禁止省略 0，比如 .5
    "no-floating-decimal": 2,
    // off; 允许这些写法，性能上更好
    "no-implicit-coercion": 0,
    // error; 浏览器端不允许定义全局变量和全局函数，可以通过挂载到window对象上和使用IIFE表达式
    "no-implicit-globals": 2,
    // off; this的使用比较灵活
    "no-invalid-this": 0,
    // error; 禁止使用 __iterator__
    "no-iterator": 2,
    // error; 禁止使用没必要的 {} 作为代码块
    "no-lone-blocks": 2,
    // off; 允许代码里面使用魔法数（多次使用，没有使用枚举的方式进行定义的数字）
    "no-magic-numbers": 0,
    // error; 禁止出现连续的多个空格，除非是注释前，或对齐对象的属性、变量定义、import 等
    "no-multi-spaces": [
      2,
      {
        ignoreEOLComments: true,
        exceptions: {
          Property: true,
          BinaryExpression: false,
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ],
    // error; 禁止使用/来进行字符串换行
    "no-multi-str": 2,
    // error; 禁止直接 new 一个类而不赋值
    "no-new": 2,
    // error; 禁止使用 new Function，比如 const expression = new Function("a", "b", "return a + b");
    "no-new-func": 2,
    // error; 对于JS的原始类型比如String, Number, Boolean等，不允许使用new 操作符
    "no-new-wrappers": 2,
    // error; 禁止使用八进制的转义符比如 "Copyright \251"
    "no-octal-escape": 2,
    // error; 禁止对函数的参数重新赋值
    "no-param-reassign": 2,
    // error; 禁止直接使用__proto__属性，可以使用getPrototypeOf替代
    "no-proto": 2,
    // error; return语句中禁止进行赋值语句操作
    "no-return-assign": 2,
    // error; 禁止在 return 语句里使用 await
    "no-return-await": 2,
    // off; 允许location.href = 'javascript:void(0)'的形式
    "no-script-url": 0,
    // error; 禁止throw一个字面量，比如 throw 2, throw "error";
    "no-throw-literal": 2,
    // error; 禁止出现没必要的 call 或 apply
    "no-useless-call": 2,
    // error; 禁止出现没必要的字符串拼接，比如 'hello' + 'world'，可以直接写成'hello world'
    "no-useless-concat": 2,
    // off; 对return的使用不进行限制
    "no-useless-return": 0,
    // error; 禁止在代码里面出现void
    "no-void": 2,
    // off; TODO 和 FIXME 类型的注释用的比较多，不限制
    "no-warning-comments": 0,
    // error; 代码里面禁止使用 with 表达式
    "no-with": 2,
    // error; Promise 的 reject方法必须传入 Error 对象，而不能是字面量
    "prefer-promise-reject-errors": 2,
    // off; parseInt的时候第二个参数可以不传入，默认就是10进制
    radix: 0,
    // error; async函数里面必须有await
    "require-await": 2,
    // off; var变量定义没必要限制太严格
    "vars-on-top": 0,

    /* section3: 变量 */
    // off; 变量定义时强制赋值或者强制先定义后赋值有点严格
    "init-declarations": 0,
    // error; 禁止label名称和var相同
    "no-label-var": 2,
    // error; 禁止将undefined当成标志符
    "no-undefined": 2,
    // error; 禁止使用未定义的变量, typeof 后面的变量除外
    "no-undef": [
      2,
      {
        typeof: false
      }
    ],
    // error; 变量使用之前必须进行定义
    "no-use-before-define": 2,

    // section 4: 代码风格相关
    // off; 数组前后括号必须换行的要求有点严格，不采纳
    "array-bracket-newline": 0,
    // error; 数组的括号前后禁止有空格
    "array-bracket-spacing": [2, "never"],
    // off; 数组里面的元素强制换行有点严格，不采纳
    "array-element-newline": 0,
    // error; 代码块如果在一行，则大括号内的首尾必须有空格，比如 function (a, b) { retur a + b; }
    "block-spacing": [2, "always"],
    // error; 大括号的用法要求
    "brace-style": 2,
    // off; 变量命名需要以驼峰命名法，对属性字段不做限制
    camelcase: [0, { properties: "never" }],
    // off; 注释的首字母必须大写，对此不做限制
    "capitalized-comments": 0,
    // error; 默认不允许尾随逗号, ie8及以下浏览器会报错
    "comma-dangle": 2,
    // error; 逗号后面强制要求加空格
    "comma-spacing": 2,
    // error; 逗号必须写在最后面
    "comma-style": [2, "last"],
    // off; 文件尾部不限制是否有新的空行
    "eol-last": 0,
    // off; 函数名和执行它的括号之间禁止有空格
    "func-call-spacing": [2, "never"],
    // off; 函数赋值给变量时，函数名必须和赋值的变量名一致的限制不采纳
    "func-name-matching": 0,
    // off; 不限制匿名函数的命名问题
    "func-names": 0,
    // off; 必须只使用函数申明或只使用函数表达式
    "func-style": 0,
    // off; 变量黑名单，不采纳
    "id-blacklist": 0,
    // off; 变量命名长度不做限制
    "id-length": 0,
    // off; 变量命令的字符需要在某个正则匹配规则里面，不采纳
    "id-match": 0,
    // error; 一个缩进必须用四个空格替代, switch语句里面的case 2个空格
    indent: [
      2,
      4,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    // error; jsx 中的属性必须用双引号
    "jsx-quotes": [2, "prefer-double"],
    // error; 对象字面量中冒号前面禁止有空格，后面必须有空格
    "key-spacing": [
      2,
      {
        beforeColon: false,
        afterColon: true,
        mode: "strict"
      }
    ],
    // error; 关键字前后必须要加上空格
    "keyword-spacing": [
      2,
      {
        before: true,
        after: true
      }
    ],
    // off; 注释的位置不进行限制
    "line-comment-position": 0,
    // off; 对换行符不限制
    "linebreak-style": 0,
    // off; 注释前后必须有空行的限制，不采纳
    "lines-around-comment": 0,
    // error; 代码块嵌套的深度禁止超过 5 层
    "max-depth": [2, 5],
    // error; 单行最多允许200个字符, 对包含url的行不进行此限制
    "max-len": [
      2,
      {
        code: 150,
        tabWidth: 2,
        ignoreUrls: true
      }
    ],
    // off; 某个文件能够放置的最大代码行数，不限制
    "max-lines": 0,
    // error; 回调函数嵌套禁止超过 3 层，多了请用 async await 替代
    "max-nested-callbacks": ["error", 3],
    // error; 函数的参数禁止超过 10 个
    "max-params": [2, 10],
    // off; 一个函数块里面的语句行数的限制，不采纳
    "max-statements": 0,
    // off; 一行中的语句数量
    "max-statements-per-line": 0,
    // off; 三目元算语句换行限制，不采纳
    "multiline-ternary": 0,
    // error; 构造函数的必须以大写字母开头
    "new-cap": 2,
    // error; new 后面类必须带上括号
    "new-parens": 2,
    // off; 链式调用必须换行的限制，不采纳
    "newline-per-chained-call": 0,
    // error; 禁止使用 Array 构造函数
    "no-array-constructor": 2,
    // off; 位操作，不进行限制
    "no-bitwise": 0,
    // off; continue语句的使用，不限制
    "no-continue": 0,
    // off; 内联注释不限制
    "no-inline-comments": 0,
    // off; 允许单独使用if语句，而不配套使用else、else if等
    "no-lonely-if": 0,
    // error; 禁止混用空格和缩进
    "no-mixed-spaces-and-tabs": 2,
    // off; 连续赋值比如 a = b = c = 4; 不限制
    "no-multi-assign": 0,
    // off; 连续空行，不限制
    "no-multiple-empty-lines": 0,
    // off; if里面不允许出现否定表达式， 不采纳
    "no-negated-condition": 0,
    // off; 允许三元表达式的嵌套使用
    "no-nested-ternary": 0,
    // off; 禁止直接 new Object
    "no-new-object": 2,
    // off; 允许使用 ++ 或 --
    "no-plusplus": 0,
    // off; 允许使用三元表达式
    "no-ternary": 0,
    // error; 禁止行尾部有空格
    "no-trailing-spaces": 2,
    // off; 允许变量名中出现下划线
    "no-underscore-dangle": 0,
    "no-unneeded-ternary": 0,
    // error; 禁止属性前有空格，比如 foo. bar()
    "no-whitespace-before-property": 2,
    // error; 大括号内的首尾必须有换行
    "object-curly-newline": [
      2,
      {
        multiline: true,
        consistent: true
      }
    ],
    // off; 对象字面量内的属性每行必须只有一个，不采纳
    "object-property-newline": 0,
    // off; 声明变量时，禁止一条语句声明多个变量
    "one-var": [
      0,
      {
        var: "never",
        let: "never",
        const: "never"
      }
    ],
    // error; 变量申明必须每行一个
    "one-var-declaration-per-line": [2, "always"],
    // error; 必须使用单引号
    quotes: [
      2,
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    // error; 结尾必须有分号
    semi: 2,
    // error; 一行有多个语句时，分号前面禁止有空格，分号后面必须有空格
    "semi-spacing": [
      2,
      {
        before: false,
        after: true
      }
    ],
    // error; 分号必须写在行尾，禁止在行首出现
    "semi-style": [2, "last"],
    "sort-keys": 0,
    "sort-vars": 0,
    // error; if, function 等的大括号之前必须要有空格
    "space-before-blocks": [2, "always"],
    // error; function 的小括号前面必须有空格
    "space-before-function-paren": [
      2,
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    // error; 小括号内的首尾禁止有空格
    "space-in-parens": [2, "never"],
    // error; 操作符左右必须有空格, const ret = 'hello' + 'world';
    "space-infix-ops": 2,
    // off; 注释空格不限制
    "spaced-comment": 0,
    // off; case 子句冒号前禁止有空格，冒号后必须有空格
    "switch-colon-spacing": [
      2,
      {
        after: true,
        before: false
      }
    ],

    // section 5: ES6 语法相关
    // off; 箭头函数返回值可以只是一个值，没必须一定用大括号写成多条语句.
    "arrow-body-style": 0,
    // off; 箭头函数的参数必须用括号包裹起来，限制去掉。当只有一个参数时，没必要使用括号
    "arrow-parens": 0,
    // error; 箭头函数的箭头前后必须有空格
    "arrow-spacing": [
      2,
      {
        before: true,
        after: true
      }
    ],
    // error; generator 的 * 前面禁止有空格，后面必须有空格
    "generator-star-spacing": [
      2,
      {
        before: false,
        after: true
      }
    ],
    // error; 禁止import重复模块
    "no-duplicate-imports": 2,
    // error; 禁止采用var去定义变量，必须使用let或者const
    "no-var": 2,
    // off; 必须使用箭头函数作为回调，不采纳
    "prefer-arrow-callback": 0,
    // error; 变量如果没有发生修改，则必须使用const进行命名
    "prefer-const": 2,
    // off; 强制使用结构的限制，不采纳
    "prefer-destructuring": 0,
    // off; 不强制使用模板字符串，字符串拼接也是可取的
    "prefer-template": 0,
    // error; ... 的后面禁止有空格
    "rest-spread-spacing": [2, "never"],
    // off; import 的排序不用限制
    "sort-imports": 0,
    // error; 模板字符串内的首尾禁止有空格，比如${test}不要写成${ test }
    // TODO: 当jsx代码里有xxProp={``}会导致eslint出错奔溃，先注释
    // 'template-curly-spacing': [2, 'never'],
    // error; yield* 后面必须加空格
    "yield-star-spacing": [2, "after"],
    "react/prop-types": 0
  }
};
```
