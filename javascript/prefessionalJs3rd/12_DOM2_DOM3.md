# DOM2 和 DOM3

## DOM 的变化

### Node 的变化

在 DOM2 级中，Node 类型包含下列特定于命名空间的属性：

- localName: 不带命名空间前缀的节点名称
- namespaceURI: 命名空间 URI 或者 null(在未指定的情况下是)
- prefix: 命名空间前缀或者 null(未指定的情况下)

DOM3 级中, 又引入了下列跟命名空间相关的方法:

- isDefaultNamespace: 在指定的 namespaceURI 是当前的默认命名空间的情况下返回 true
- lookupNamespaceURI(prefix): 返回给定 prefix 的命名空间
- lookupPrefix(namespaceURI): 返回给定 namespaceURI 的前缀

### Document 类型的变化

- createElementNS
- createAttributesNS
- getElementByTagNameNS

```js
var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
```

### Element 类型的变化

### 其他方面的变化

1. DocumentType 的变化
2. Document 类型的变化

```js
var doctype = document.implementation.createDocumentType(
  'html',
  '-//W3C//DTD ..',
  '...'
)
var doc = document.implementation.createDocument('http: //..', 'html', doctype)
// 创建文档
document.implementation.createHTMLDocument() // 该方法只需传入文档的标题
```

3. Node 类型的变化
   添加了 isSupported()方法：用于确定当前节点具有什么能力，接收两个参数：特性名和特性版本号

   ```js
   if (document.body.isSupported('HTML', '2.0')) {
     // 执行只有'DOM2级才支持的操作'
   }
   ```

   DOM3 级引入了两个辅助比较节点的方法：isSameNode isEqualNode，都接受一个节点参数，并在传入节点与引用的节点相同或者相等时返回 true

   ```js
   var div1 = document.createElement('div')
   div1.setAttribute('class', 'box')
   var div2 = document.createElement('div')
   div2.setAttribute('class', 'box')

   div1.isSameNode(div2) // false
   div1.isEqualNode(div2) // true
   div1.isSameNode(div1) // true
   ```

   还针对 dom 节点添加额外数据引入了新方法
   setUserData 接收 3 个参数(键值，数据，回调函数) 回调函数会在节点被复制、删除、重命名或者被移除一个新文档时触发
   处理函数接收 5 个参数

   getUserData

## 样式

### 访问元素的样式

任何支持 style 特性的 HTML 元素在 JavaScript 中都有一个对应的 style 属性， 这个 style 对象是 CSSStyleDecleration 的实例

1. DOM 样式属性和方法
   cssText: 能够访问到 style 特性中的 CSS 代码
