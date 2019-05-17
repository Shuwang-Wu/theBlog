1. 浏览器创建 Document 对象, 并且开始解析 web 页面，解析 HTML 元素和它们的文本内容后添加 element 对象和 text 节点到文档中
   这个阶段 document.readstate= 'loading'
2. 当 HTML 解析器遇到没有 async 和 defer 属性的 script 元素时，它把这些元素添加到文档中，然后执行行内或者外部脚本
