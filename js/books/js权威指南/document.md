# Document 对象 它的 Element 对象和文档中表示文本的 Text 对象都是 Node 对象

1. parentNode

2. childNodes

3. firstChild、lastChild

4. nextSibling、previousSibling

5. nodeType
   9 代表 Document 节点
   1 代表 element 节点
   3 代表 text 节点
   8 代表 comment 节点
   11 代表 documentFragMent 节点

6. nodeValue

7. nodeName

- 关于 innerHTML

web 浏览器一般擅长解析 HTML, 通常设置 innerHTML 的效率非常高
但是对 innerHTML 属性用 '+=' 操作符重复追加一小段文本效率十分低下 , 因为既要序列化又要解析

- textContent

查询纯文本形式的元素内容, 或者在文档中插入纯文本

```js
var para = document.getElementById('home')
var text = para.textContent
para.textContent = 'This is home element'
```

- textContent 和 innerText 属性相似
