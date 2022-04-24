# DOM

理解包含不同层次节点的 DOM
使用不同的节点类型
克服浏览器兼容性问题及各种陷阱

## 节点层次

DOM 可以将任何 HTML 或 XML 文档描绘成一个由多层次节点构成的结构

insertBefore(node): 将节点插入父节点的某个节点前面
appendChild(node): 将节点追加到父节点的末尾
cloneNode(boolean): 值为 true 则进行深拷贝, false 则进行浅拷贝
replaceChild(node): 替换新的元素

document 对象是 HTMLDocument 的一个实例

document.documentElement 代表 html 元素
document.body 代表 body 元素
document.doctype 代表文档类型的引用
document.title 设置/获取文档标题
document.url 获取完整的 url
document.domain 设置/获取域名
document.referrer 取得来源页面的 URL
document.anchors: 包含文档中所有带有 name 特性的<a>元素
document.applets:

- 查找元素
  getElementById
  getElementsByTagName

### Element 类型

所有的 HTML 元素都是通过 HTMLElement 类型表示, 不是直接通过这个类型, 也是通过它的子类型来表示

1. 获取元素
2. 取得特性
