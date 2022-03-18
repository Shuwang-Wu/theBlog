#vue

## Prop 验证

```js
props: {
  // 指定传入的值类型
  propA: Number,
  // 同上，其中之一即可
  propB: [String, Number],
  // 指定类型且设置默认值
  propC: {
    type: Number,
    default: 1
  },
  // 是否为必传属性
  propD: {
    required: true | false
  },
  //
  propE: {
    type: Object,
    //  如果传入的属性类型是对象或者数组, 默认值必须从一个工厂函数返回 为什么呢 ？ 暂时没有找到答案！
    default: function() {
      return { message: 'return from factory function'}
    }
  },
  propF: {
    type: Object,
    validator: function(obj) {
      return obj.name === 'sw'
    }
  }
}
```

## computed

如果计算的逻辑复杂，应当使用 computed, 与 method 的区别是其会缓存计算结果

```js
export default {
  name: 'example',
  data() {
    return {
      str: '123'
    }
  },
  computed: {
    reverseStr() {
      return this.str
        .split('')
        .reverse()
        .join()
    },
    fullName: {
      // getter
      get: function() {
        return this.firstName + ' ' + this.lastName
      },
      // setter
      set: function(newVal) {
        var names = (newVal.split(' ')
        ;[(this.firstName, this.lastName)] = names)
      }
    }
  }
}
```

## mixin

混入 (mixins) 是一种分发 Vue 组件中可复用功能的非常灵活的方式;
混入对象可以包含任意组件选项;
当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项;
自己的一些理解：mixin 就是相当于基类，所有通过集成基类的对象都可以调用其方法和属性

1. 基础

```js
var myMixin = {
  created: function() {
    this.hello()
  },
  methods: {
    hello: function() {
      console.log('hello from mixin!')
    }
  }
}

var Component = Vue.extend({
  mixins: [myMixn]
})

var component = new Compoent() // => "hello from mixin"
```

2. 选项合并
3. 全局混入
4. 自定义选项合并策略

## directive

1. 周期函数

```js
Vue.directive('focus', {
  bind: function() {},
  inserted: function(el) {
    el.focus()
  },
  update: function() {},
  componentUpdated: function() {},
  unbind: function() {}
})
// <input v-focus />
<>
```

2. 钩子函数的参数
   2.1 el: 指令所绑定的元素, 可以用来直接操作 DOM;
   2.2 binding

   ```js
   binding: {
     name: 指令名
     value: 指令的绑定值
     oldValue: 指令的前一个绑定值
     expression: 字符串形式的指令表达式
     arg: 传给指令的参数
     modifier: 一个包含修饰符的对象
   }
   ```

   2.3 vnode: Vue 编译生成的虚拟节点
   2.4 oldVnode: 上一个虚拟节点

3. 函数简写
   如果想在 bind 和 uodate 时触发相同行为, 其他的钩子函数不作处理

```js
Vue.directive('red', function(el, binding) {
  el.style.backgroundColor = 'red'
})
```

4. 对象字面量
   如果指令需要传入多个值, 可以采用对象字面量的方式

   ```js
   Vue.directive('print',function(el, binding){
     console.log(binding.value) // {{a: 1, b: 2}}
   })
   <!-- <div v-print="{a: 1, b: 2}"></div> -->
   ```

## 渲染函数&jsx

```js
Vue.component('anchored-heading', {
  render: function(createElement) {
    return createElement('h' + this.level, this.$slot.default)
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

1. createElement 参数

## vue指令详解

### v-bind
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
    <title>Document</title>    
</head>
<body>
    <div id="app"><a v-bind:href="href">链接</a></div>
    <script>
    Vue.config.productionTip=false;
    Vue.config.devtools=false;
    var app = new Vue({
        el:'#app',
        data:{href:"http://www.baidu.com"}
    })
    </script> 
</body>
</html>
```

以上面的例子为例,Vue内部将DOM解析成AST对象的时候会执行parse()函数，该函数解析到a节点时会执行到processElement()函数，该函数先将key、ref、插槽、class和style解析完后就会执行processAttrs()函数，如下:

```js
function processAttrs (el) {    //第9526行  对剩余的属性进行分析
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp; 
  for (i = 0, l = list.length; i < l; i++) {              //遍历每个属性
    name = rawName = list[i].name; 
    value = list[i].value;
    if (dirRE.test(name)) {                                //如果该属性以v-、@或:开头，表示这是Vue内部指令
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers 
      modifiers = parseModifiers(name);                     //获取修饰符，比如:{native: true,prevent: true}
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind                      //bindRD等于/^:|^v-bind:/ ，即该属性是v-bind指令时 例如:<a :href="url">你好</a>
        name = name.replace(bindRE, '');                          //去掉指令特性，获取特性名，比如 href
        value = parseFilters(value);                              //对一些表达式做解析，例如{a|func1|func2}
        isProp = false;                                           //是否绑定到DOM对象上
        if (modifiers) {
          if (modifiers.prop) {                                   //如果有修饰符
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)    //如果isProp为true
        )) {                                                                            //则调用addProp()
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);                                               //否则调用addAttr()
        }
      } else if (onRE.test(name)) { // v-on                     //onRE等于/^@|^v-on:/，即该属性是v-on指令时
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives                             //普通指令
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      /*略*/
    }
  }
}
```

addAttr()函数用于在AST对象上新增一个attrs属性，如下:

```js
function addAttr (el, name, value) {    //第6550行 
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });     //将{name: name,value: value}保存到el.attrs里面
  el.plain = false;                                                      //修正el.plain为false
}
```

执行generate()函数获取data$2时会判断是否有attrs属性，如果有则将属性保存到attrs上，例子里的实例渲染后render函数等于:
```js
  if (el.attrs) { 　　　　//第10306行
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
```

genProps用于拼凑对应的值，如下:
```js
function genProps (props) {     //第10537行 拼凑AST对象的属性或DOM属性用的
  var res = '';   
  for (var i = 0; i < props.length; i++) {    //遍历prps
    var prop = props[i];                         //对应的值
    /* istanbul ignore if */
    {
      res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";   //拼凑字符串
    }
  }
  return res.slice(0, -1)
}
```

例子执行到这里渲染的render函数等于:
```js
with(this) {
    return _c('div', {
        attrs: {
            "id": "app"
        }
    },
    [_c('a', {
        attrs: {
            "href": href
        }
    },
    [_v("链接")])])
}
```

这样当该函数执行的时候就会触发Vue实例的href属性，此时就会将渲染watcher作为href属性的订阅者了，当href修改时就会触发渲染watcher的重新渲染了。
最后当a标签整个DOM元素生成之后会触发attrs模块的create事件去设置href特性，如下:
```js
function updateAttrs (oldVnode, vnode) {      //第6294行 更新attrs
  var opts = vnode.componentOptions;                                      //获取vnode.componentOptions(组件才有)
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {        //如果在oldVnode和vnode上都没有定义attrs属性
    return                                                                     //则直接返回，不做处理
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};                             //新VNode的attrs属性
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {                                            //遍历新VNode的每个attrs
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);                                     //则调用setAttr设置属性
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {       //IE9的特殊情况
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {         //设置el元素的key属性为value
  if (el.tagName.indexOf('-') > -1) {            //如果el的标签名里含有-
    baseSetAttr(el, key, value); 
  } else if (isBooleanAttr(key)) {                //如果key是布尔类型的变量(比如:disabled、selected)
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {             //如果key是这三个之一:contenteditable,draggable,spellcheck
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {                                          //不满足上述的情况就直接调用baseSetAttr设置属性
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {         //设置el的key属性为value
  if (isFalsyAttrValue(value)) {                  //如果value是null或false
    el.removeAttribute(key);                       //则删除属性
  } else { 
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if ( 
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {                                         特殊情况 
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);                    //直接调用原生DOMAPI setAttribute设置属性
  }
}
```
