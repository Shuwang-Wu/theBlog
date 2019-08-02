# 常见跨域问题

## 什么是跨域 ？

跨域指的是在当前域名下去请求其他域名的资源

## 什么是同源策略 ？

同源策略/SOP（Same origin policy）是一种约定，由 Netscape 公司 1995 年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS、CSFR 等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个 ip 地址，也非同源

## 跨域的解决方案

1. jsonp
2. document.domain + iframe
3. window.name + iframe
4. postMessage
5. nginx 代理
6. node 中间件代理
7. webSocket 协议

### jsonp

1. 通过 script 标签

```js
function handleCallback(res) {
  // handle response
}
var script = document.createElement('script')
script.type = 'text/javascript'
script.src = 'http://www.test.com?callback=handleCallback'
```

2. 通过 ajax

```js
function handleCallback(res) {
  // handle response
}
$.ajax({
  url: 'http://www.test.com',
  type: 'get',
  dataType: 'jsonp',
  jsonpCallback: 'handleCallback'
})
```

3. nodejs 示例代码

```js
var queryString = require('querystring')
var http = require('http')
var server = http.createServer
server.on('request', function(req, res) {
  var _data = {
    msg: 'jsonpMessage'
  }
  var params = qs.parse(req.url.split('?')[1])
  var fn = params.callback
  res.writeHead(200, '{Content-Type: text/javascript}')
  res.send(fn + '(' + JSON.stringify(_data) + ')')
  res.end()
})
server.listen(3000)
console.log('server listening on port 3000 ... ')
```

### document.domain + iframe 跨域

此方案仅限主域相同，子域不同的跨域应用场景
实现原理: 两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域

1. 父窗口 (http://www.domain.com/a.html)

```html
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
```

```js
document.domain = 'domian.com'
var usre = 'admin'
```

2. 子窗口 (http://child.domain.com/b.html)

```js
document.domain = 'domain.com'
console.log(window.parant.user)
```

### location.hash + iframe

### window.name + iframe 跨域

略

### windo.name + iframe 跨域

略

### postMessage 跨域

### 跨域资源共享（CORS）

普通跨域请求：只服务端设置 Access-Control-Allow-Origin 即可，前端无须设置，若要带 cookie 请求：前后端都需要设置
