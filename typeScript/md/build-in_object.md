# 内置对象

## ECMAScript 标准提供的内置对象有：

Boolean、Error、Date、RegExp 等等

```ts
let b: Boolean = new Boolean(1);
let e: Error = new Error("Error occurred");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
```

## DOM 和 BOM 提供的内置对象

Document、HTMLElement、Event、NodeList 等

```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
document.addEventListener("click", function(e: MouseEvent) {
  // Do something
});
```
