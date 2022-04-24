<!--
 * @author       : shuwang.wu@getech.cn
 * @createdDate  : 2021-02-24 14:52:37
 * @version      : 1.0
 * @modifier     : shuwang.wu@getech.cn
 * @modifiedDate : 2021-02-25 11:59:29
 * @reason       :
 * @FilePath     : \notes\notes\vue\compiler-principle.md
-->

# Vue 编译原理

[编译过程](./2020-08-19-032238.jpg)

## Vue 的版本

- vue.js: 完整版本，包含了模版编译的能力
- vue.runtime.js: 运行时版本，不提供模版编译能力，需要通过 vue-loader 进行提前编译

## 编译相关

### 编译入口

完整版入口文件 src/platforms/web/entry-runtime-with-compiler.js

```js
// 省略了部分代码，只保留了关键部分
import { compileToFunctions } from "./compiler/index";
const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (el) {
  const options = this.$options;

  // 如果没有render方法，则进行template编译
  if (!options.render) {
    let template = options.template;
    if (template) {
      // 调用compileToFunctions, 编译template, 得到render方法
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          shouldDecodeNewlines,
          shouldDecodeNewlineForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      );
      options.render = render;
    }
  }
  return mount.call(this, el, hydrating);
};
```

./compiler/index 文件的 compileToFunctions

```js
import { baseOptions } from "./options";
import { createCompiler } from "compiler/index";

// 通过 createCompiler 方法生成编译函数
const { compile, compileToFunctions } = createCompiler(baseOptions);
export { compile, compileToFunctions };

export function createCompiler(baseOptions) {
  const baseCompile = (template, options) => {
    // 解析 html，转化为 ast
    const ast = parse(template.trim(), options);
    // 优化 ast，标记静态节点
    optimize(ast, options);
    // 将 ast 转化为可执行代码
    const code = generate(ast, options);
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    };
    const compile = (template, options) => {
      const tips = [];
      const errors = [];
      // 收集编译过程中的错误信息
      options.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg);
      };
      // 编译
      const compiled = baseCompile(template, options);
      compiled.errors = errors;
      compiled.tips = tips;

      return compiled;
    };
    const createCompileToFunctionFn = () => {
      // 编译缓存
      const cache = Object.create(null);
      return (template, options, vm) => {
        // 已编译模板直接走缓存
        if (cache[template]) {
          return cache[template];
        }
        const compiled = compile(template, options);
        return (cache[key] = compiled);
      };
    };
    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
}
```

#### 主流程

主要的编译逻辑基本都在 baseCompile 方法内, 主要分为三个步骤

1. 模板编译，将模板代码转化为 AST
2. 优化 AST，方便后续虚拟 DOM 更新
3. 生成代码，将 AST 转化为可执行的代码

```js
const baseCompile = (template, options) => {
  // 解析 html，转化为 ast
  const ast = parse(template.trim(), options);
  // 优化 ast，标记静态节点
  optimize(ast, options);
  // 将 ast 转化为可执行代码
  const code = generate(ast, options);
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
};
```

#### parse

##### AST

parse 方法，该方法的主要作用就是解析 HTML，并转化为 AST（抽象语法树）
[vue 模版](./vue-html.png)
[parse 之后的 ast](./parse-2-ast.png)

```js
// 解析之后的ast
{
  attrsList: [], // 标签属性
  attrsMap: [], // 标签属性
  children: [
  ], // 标签属性
  end: 135, // 在html中结束的位置
  parent: undefined, // 标签属性
  plain: true,
  rawAttrsMap: {},
  start: 0, // 在html中开始的位置
  static: false, // 是否为不可变的节点
  staticRoot: false,
  tag: 'div', // 标签名
  type: 1 // 标签类型 1.元素节点 2.表达式 3.文本
}
```

##### 解析 HTML

parse 的整体逻辑较为复杂，我们可以先简化一下代码，看看 parse 的流程

```js
import { parseHTML } from "./html-parser";

export function parse(template, options) {
  let root;
  parseHTML(template, {
    // some options...
    start() {}, // 解析到标签位置开始的回调
    end() {}, // 解析到标签位置结束的回调
    chars() {}, // 解析到文本时的回调
    comment() {} // 解析到注释时的回调
  });
  return root;
}

export function parseHTML(html, options) {
  let index = 0;
  let last, lastTag;
  const stack = [];
  while (html) {
    last = html;
    let textEnd = html.indexOf("<");

    // "<" 字符在当前 html 字符串开始位置
    if (textEnd === 0) {
      // 1、匹配到注释: <!-- -->
      if (/^<!\--/.test(html)) {
        const commentEnd = html.indexOf("-->");
        if (commentEnd >= 0) {
          // 调用 options.comment 回调，传入注释内容
          options.comment(html.substring(4, commentEnd));
          // 裁切掉注释部分
          advance(commentEnd + 3);
          continue;
        }
      }

      // 2、匹配到条件注释: <![if !IE]>  <![endif]>
      if (/^<!\[/.test(html)) {
        // ... 逻辑与匹配到注释类似
      }

      // 3、匹配到 Doctype: <!DOCTYPE html>
      const doctypeMatch = html.match(/^<!DOCTYPE [^>]+>/i);
      if (doctypeMatch) {
        // ... 逻辑与匹配到注释类似
      }

      // 4、匹配到结束标签: </div>
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
      }

      // 5、匹配到开始标签: <div>
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
      }
    }
    // "<" 字符在当前 html 字符串中间位置
    let text, rest, next;
    if (textEnd > 0) {
      // 提取中间字符
      rest = html.slice(textEnd);
      // 这一部分当成文本处理
      text = html.substring(0, textEnd);
      advance(textEnd);
    }
    // "<" 字符在当前 html 字符串中不存在
    if (textEnd < 0) {
      text = html;
      html = "";
    }

    // 如果存在 text 文本
    // 调用 options.chars 回调，传入 text 文本
    if (options.chars && text) {
      // 字符相关回调
      options.chars(text);
    }
  }
  // 向前推进，裁切 html
  function advance(n) {
    index += n;
    html = html.substring(n);
  }
}
```

[解析 html](./parse-html.png)

```js
parseHTML(template, {
  // some options...

  // 解析到标签位置开始的回调
  start(tag, attrs, unary) {},
  // 解析到标签位置结束的回调
  end(tag) {},
  // 解析到文本时的回调
  chars(text: string) {},
  // 解析到注释时的回调
  comment(text: string) {}
});
```

处理开始标签

```js
function makeAttrsMap(attrs) {
  const map = {};
  for (let i = 0, l = attrs.length; i < l; i++) {
    const { name, value } = attrs[i];
    map[name] = value;
  }
  return map;
}
function createASTElement(tag, attrs, parent) {
  const attrsList = attrs;
  const attrsMap = makeAttrsMap(attrsList);
  return {
    type: 1, // 节点类型
    tag, // 节点名称
    attrsMap, // 节点属性映射
    attrsList, // 节点属性数组
    parent, // 父节点
    children: [] // 子节点
  };
}
const stack = [];
let root; // 根节点
let currentParent; // 暂存当前的父节点
parseHTML(template, {
  // some options...

  // 解析到标签位置开始的回调
  start(tag, attrs, unary) {
    // 创建 AST 节点
    let element = createASTElement(tag, attrs, currentParent);

    // 处理指令: v-for v-if v-once
    processFor(element);
    processIf(element);
    processOnce(element);
    processElement(element, options);

    // 处理 AST 树
    // 根节点不存在，则设置该元素为根节点
    if (!root) {
      root = element;
      checkRootConstraints(root);
    }
    // 存在父节点
    if (currentParent) {
      // 将该元素推入父节点的子节点中
      currentParent.children.push(element);
      element.parent = currentParent;
    }
    if (!unary) {
      // 非单标签需要入栈，且切换当前父元素的位置
      currentParent = element;
      stack.push(element);
    }
  }
  // 解析到标签位置结束的回调
  end() {
    const element = stack[stack.length - 1]
    const lastNode = element.children[element.children.length - 1]
    // 处理尾部空格的情况
    if (lastNode && lastNode.type === 3 && lastNode.text === ' ') {
      element.children.pop()
    }
    // 出栈，重置当前的父节点
    stack.length -= 1
    currentParent = stack[stack.length - 1]
  }
  chars(text) {
    if (!currentParent) {
      // 文本节点外如果没有父节点则不处理
      return
    }

    const children = currentParent.children
    text = text.trim()
    if (text) {
      // parseText 用来解析表达式
      // delimiters 表示表达式标识符，默认为 ['{{', '}}']
      const res = parseText(text, delimiters))
      if (res) {
        // 表达式
        children.push({
          type: 2,
          expression: res.expression,
          tokens: res.tokens,
          text
        })
      } else {
        // 静态文本
        children.push({
          type: 3,
          text
        })
      }
    }
  }
});
```

parseText 解析表达式

```js
// 构造匹配表达式的正则
const buildRegex = (delimiters) => {
  const open = delimiters[0];
  const close = delimiters[1];
  return new RegExp(open + "((?:.|\\n)+?)" + close, "g");
};

function parseText(text, delimiters) {
  // delimiters 默认为 {{ }}
  const tagRE = buildRegex(delimiters || ["{{", "}}"]);
  // 未匹配到表达式，直接返回
  if (!tagRE.test(text)) {
    return;
  }
  const tokens = [];
  const rawTokens = [];
  let lastIndex = (tagRE.lastIndex = 0);
  let match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    // 表达式开始的位置
    index = match.index;
    // 提取表达式开始位置前面的静态字符，放入 token 中
    if (index > lastIndex) {
      rawTokens.push((tokenValue = text.slice(lastIndex, index)));
      tokens.push(JSON.stringify(tokenValue));
    }
    // 提取表达式内部的内容，使用 _s() 方法包裹
    const exp = match[1].trim();
    tokens.push(`_s(${exp})`);
    rawTokens.push({ "@binding": exp });
    lastIndex = index + match[0].length;
  }
  // 表达式后面还有其他静态字符，放入 token 中
  if (lastIndex < text.length) {
    rawTokens.push((tokenValue = text.slice(lastIndex)));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join("+"),
    tokens: rawTokens
  };
}
```

### optimize

拿到 AST 之后还需要进行一系列优化，确保静态的数据不会进入虚拟 DOM 的更新阶段，以此来优化性能

```js
export function optimize(root, options) {
  if (!root) return;
  // 标记静态节点
  markStatic(root);
}
```

简单来说，就是把所以静态节点的 static 属性设置为 true

```js
function isStatic(node) {
  // 表达式，返回 false
  if (node.type === 2) {
    return false;
  }
  // 静态文本，返回 true
  if (node.type === 3) {
    return true;
  }
  // 此处省略了部分条件
  return !!(
    (
      !node.hasBindings && // 没有动态绑定
      !node.if &&
      !node.for && // 没有 v-if/v-for
      !isBuiltInTag(node.tag) && // 不是内置组件 slot/component
      !isDirectChildOfTemplateFor(node) && // 不在 template for 循环内
      Object.keys(node).every(isStaticKey)
    ) // 非静态节点
  );
}
function markStatic(node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // 如果是元素节点，需要遍历所有子节点
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i];
      markStatic(child);
      if (!child.static) {
        // 如果有一个子节点不是静态节点，则该节点也必须是动态的
        node.static = false;
      }
    }
  }
}
```

##### generate

得到优化的 AST 之后，就需要将 AST 转化为 render 方法。还是用之前的模板

```html
<div>
  <h2 v-if="message">{{message}}</h2>
  <button @click="showName">showName</button>
</div>
```

```js
// {
//   render: "with(this){return _c('div',[(message)?_c('h2',[_v(_s(message))]):_e(),_v(" "),_c('button',{on:{"click":showName}},[_v("showName")])])}"
// }
// _c对应的是createElement;
with (this) {
  return _c("div", [
    message ? _c("h2", [_v(_s(message))]) : _e(),
    _v(" "),
    _c("button", { on: { click: showName } }, [_v("showName")])
  ]);
}
```

[render-helpers](./render-helpers.png)
具体转化方法就是一些简单的字符拼接

```js
export function generate(ast, options) {
  const state = new CodegenState(options);
  const code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  };
}
export function genElement(el, state) {
  let code;
  const data = genData(el, state);
  const children = genChildren(el, state, true);
  ode = `_c('${el.tag}'${
    data ? `,${data}` : "" // data
  }${
    children ? `,${children}` : "" // children
  })`;
  return code;
}
```
