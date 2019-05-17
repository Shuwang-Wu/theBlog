# JSX

```jsx
const elem = <h1>h1</h1>
```

这种看起来比较奇怪的标签语法既不是字符串也不是 html

它被称为 JSX, 一种 javascript 的语法扩展

## 在 JSX 中使用表达式

```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName
}

let user = {
  firstName: 'wu',
  lastName: 'shuwang'
}

const elem = <h1>hello, {formatName(user)}!</h1>

ReactDom.render(elem, document.getElementById('app'))
```

## JSX 本身其实也是表达式

在编译之后, JSX 其实会被转化为普通的 Javascript 对象

这也意味着, 你其实可以在 if 或者 for 语句里使用 JSX, 将它复制给变量, 当作参数传入, 或者作为返回值都可以

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>hello, {formatName(user)}!</h1>
  }
  return <h1>hello, strange!</h1>
}
```

## JSX 属性

可以使用引号来定义值为字符串的参数

```jsx
<h1 tabIndex="0">hello, jsx!</h1>
```

也可以使用大括号来定义值为变量的参数

```jsx
<h1 tabIndex={an variable already define}>hello, jsx!</h1>
```

## JSX 嵌套

可以使用单闭合标签

```jsx
const h1 = <h1 />
```

也可以嵌套使用

```jsx
const element = (
  <div>
    <h1 />
    <h2 />
  </div>
)
```

## jsx 防注入攻击

ReactDom 在渲染之前会默认过滤所有传入的值, 它可以确保你的应用不会被注入攻击。
所有的内容在渲染之前都转换成了字符串，这样有效的放置 XSS(跨站脚本)攻击

```jsx
const title = 'title'
const element = <a>{title}</a>
```

## JSX 代表 Object

Babel 转译器会把 JSX 转换成一个名为 React.createElement() 的方法调用

```js
const element = <h1 className="greeting">Hello, world!</h1>
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
)
```

React.createElement() 这个方法首先会进行一些避免 bug 的检查，之后会返回一个类似下面例子的对象：

```js
// 注意: 以下示例是简化过的（不代表在 React 源码中是这样）
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
}
```
