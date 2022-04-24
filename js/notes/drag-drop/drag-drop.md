# Drag & Drop
之前看过也做过类似功能,但是一直没有深入去了解, 刚好最近要用到, 所以希望可以好好回顾与学习一番

> HTML 的 drag & drop 使用了 DOM event model 以及从 mouse events 继承而来的 drag events 。一个典型的拖拽操作开始于用户选中一个可拖动的（draggable）元素，并将其拖动（鼠标不放开）到一个可放置的（droppable）元素，然后释放鼠标。

## 拖动事件类型
所有的 drag event types 有一个对应的 global event handler。每个拖动事件类型和拖动全局属性都有对应的描述文档。下面的表格提供了一个简短的事件类型描述，以及一个相关文档的链接。

- drag
  当拖动元素或选中的文本时触发。
- dragstart
  当用户开始拖动一个元素或选中的文本时触发
- dragover
  当元素或选中的文本被拖到一个可释放目标上时触发（每100毫秒触发一次）
- dragleave
  当拖动元素或选中的文本离开一个可释放目标时触发。
- dragenter
  当拖动元素或选中的文本到一个可释放目标时触发
- dragend
  当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键). 
- dragexit
  当拖动元素或选中的文本到一个可释放目标时触发
- drop
  当元素或选中的文本在可释放目标上被释放时触发

## 接口
HTML的拖拽接口有DragEvent, DataTransfer, DataTransferItem, DataTransferItemList.
- DragEvent 
  DragEvent 接口有一个构造函数和一个 dataTransfer 属性，dataTransfer 属性是一个 DataTransfer 对象。
- DataTransfer 
  对象包含了拖拽事件的状态，例如拖动事件的类型（如拷贝 copy 或者移动 move），拖动的数据（一个或者多个项）和每个拖动项的类型（MIME类型）。 DataTransfer 对象也有向拖动数据中添加或删除项目的方法。
  每个 DataTransfer 都包含一个  items 属性，这个属性是 DataTransferItem 对象的 list。一个 DataTransferItem 代表一个拖动项目，每个项目都有一个 kind 属性（string 或 file） 和一个表示数据项目 MIME 类型的 type 属性。DataTransferItem 对象也有获取拖动项目数据的方法。
- DataTransferItemList 
  是 DataTransferItem 对象的列表。这个列表对象包含以下方法：
  - 向列表中添加拖动项
  - 从列表中移除拖动项
  - 清空列表中所有的拖动项。
- DataTransfer 和 DataTransferItem 接口的一个主要的不同
  是前者使用同步的 getData() 方法去得到拖动项的数据，而后者使用异步的 getAsString() 方法得到拖动项的数据。

## 基础

### 确定什么是可以拖动的
让一个元素可以进行拖动需要添加draggable属性，再加上全局事件处理函数ondragstart,如下面的代码所示
```js
function dragstart_handler () {
  // Add the target element`s id to the data transfer object
  ev.dataTransfer.setData('text/plain', ev.target.id)
}
window.addEventListener('DOMContentLoaded', () => {
  // Get the element by id
  const element = document.getElementById('p1')
  element.addEventListener('dragstart', dragstart_handler)
})
```

### 定义拖动数据
应用程序可以在拖动操作中包含任意数量的数据项，每个数据项都是一个String类型，典型的MIME类型，如：text/html
每个 drag event 都有一个dataTransfer 属性，其中保存着事件的数据。这个属性（DataTransfer 对象）也有管理拖动数据的方法。setData() 方法为拖拽数据添加一个项，如下面的示例代码所示：
```js
function dragstart_handler(ev) {
  // 添加拖拽数据
  ev.dataTransfer.setData("text/plain", ev.target.innerText);
  ev.dataTransfer.setData("text/html", ev.target.outerHTML);
  ev.dataTransfer.setData("text/uri-list", ev.target.ownerDocument.location.href);
}
```

### 定义拖动图像
拖动过程中，浏览器会在鼠标旁显示一张默认图片。当然，应用程序也可以通过 setDragImage() 方法自定义一张图片，如下面的例子所示。
```js
function dragstart_handler(ev) {
  // Create an image and then use it for the drag image.
  // NOTE: change "example.gif" to a real image URL or the image 
  // will not be created and the default drag image will be used.
  var img = new Image(); 
  img.src = 'example.gif'; 
  ev.dataTransfer.setDragImage(img, 10, 10);
}
```

### 定义拖动效果
dropEffeect属性用来控制拖放操作中用户给予的反馈。它会影响到拖动过程中浏览器显示的鼠标样式。比如，当用户悬停在目标元素上的时候，浏览器鼠标也许要反映拖放操作的类型。
有 3 个效果可以定义：
1. copy 表明被拖动的数据将从它原本的位置拷贝到目标的位置。
2. move 表明被拖动的数据将被移动。
3. link 表明在拖动源位置和目标位置之间将会创建一些关系表格或是连接。
   
### 定义一个放置区
当拖动一个项目到 HTML 元素中时，浏览器默认不会有任何响应。想要让一个元素变成可释放区域，该元素必须设置 ondragover 和 ondrop 事件处理程序属性，下面的例子通过简单的事件处理展示了如何使用这些属性
```html
<script>
function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("text/plain");
 ev.target.appendChild(document.getElementById(data));
}
</script>

<p id="target" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">Drop Zone</p>
```

### 设置放置效果
```html
<script>
function dragstart_handler(ev) {
 // Add the target element's id to the data transfer object
 ev.dataTransfer.setData("application/my-app", ev.target.id);
 ev.dataTransfer.dropEffect = "move";
}
function dragover_handler(ev) {
 ev.preventDefault();
 ev.dataTransfer.dropEffect = "move"
}
function drop_handler(ev) {
 ev.preventDefault();
 // Get the id of the target and add the moved element to the target's DOM
 var data = ev.dataTransfer.getData("application/my-app");
 ev.target.appendChild(document.getElementById(data));
}
</script>

<p id="p1" draggable="true" ondragstart="dragstart_handler(event)">This element is draggable.</p>
<div id="target" ondrop="drop_handler(event)" ondragover="dragover_handler(event)">Drop Zone</div>
```