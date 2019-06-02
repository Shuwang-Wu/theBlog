# DOM 扩展

理解 selectorsAPI
使用 HTML5DOM 扩展
了解专有的 DOM 扩展

## 选择符 API

1. querySelector
   接收一个 css 选择符, 返回该模式匹配的第一个元素, 如果没有匹配的元素返回 null
2. querySelectorAll
   接收一个 css 选择符, 返回 NodeList 的实例, 如果没有匹配的元素返回 []
3. matchesSelector
   接收一个 css 选择符, 如果调用元素与该选择符匹配, 返回 true 否则返回 false

## 元素遍历

```js
var i,
  len,
  child = element.firstChild

while (child != element.lastChild) {
  if (child.nodeType === 1) {
    processChild(child)
  }
  child = element.lastChild
}
```

## HTML5

### 与类相关的扩充

1. getElementsByClassName()
2. classList 属性
   是新集合 DOMTockenList 的实例

```js
// 首先, 取得类名字符串并拆分成数组
var classNames = div.className.split(/\s+/)
// 找到要删的类名，假设是'exampleCls'
var pos
for (var i = 0; i < classNames.length; i++) {
  if (classNames[i] === 'exampleCls') {
    pos = [i]
    break
  }
}
classNames.splice(i, 1)
classNames.join(' ')
```

### 焦点管理

1. document.activeElement
   html5 中添加的辅助管理 DOM 焦点的功能，这个属性始终会引用 DOM 中当前获得了焦点的元素
2. document.hasFocus
   这个方法用于确定文档是否获得了焦点

### HTMLDocument 的变化

1. readyState 属性
   通过 document.readyState 来获取, 存在两个值分别是: loading, complete

2. 兼容模式
   可以通过 document.compatMode 来进行获取, 标准模式是：CSS1Compat, 而在混杂模式值为 BackCompat

3. head 属性
   document.head 直接可以获取 head 元素
4. 插入标记
   outerHTML：通过字符串的形式返回标记的全部内容
   insertAdjacentHTML: 插入文本到指定位置，传入的参数为(插入位置，插入内容)

5. scrollIntoView 方法

### 专有扩展

1. 文档模式

2. children 属性

3. contains
   当你需要知道某个节点是不是另一个节点的后代
   ```js
   <!-- 可以如下这样对节点进行测试 -->
   document.documentElement.contains(document.body)
   ```
4. 插入文本
   innerText, outerText 这两个 API 可以插入文本，但是没有被 HTML5 收录

5. 滚动
   scrollIntoViewIfNeeded: 只有在当前元素在视口中不可见的情况下，才滚动浏览器窗口或容器元素，最终让它可见
   scrollByLines(lineCount): 将内容滚动指定的行高
   scrollByPage(pageCount): 将元素的内容滚动指定的也 moan 高度
