# CORS

## 图像 ping

使用 img 标签，因为一个网页可以从任何网页中加载图像，不用担心跨域不跨域

```js
var img = new Image()
img.onload = img.onerror = function() {
  alert('Done!')
}
imf.src = 'http://www/example.com
```

缺点： 一是只能发起 get 请求；二是无法访问服务器的响应文本

## JSONP

由两部分组成：回调函数和数据

```js
function handleResponse(response) {
  alert(
    'You`re at IP address ' +
      response.ip +
      ', which is in ' +
      response.city +
      ', ' +
      response.region_name
  )
}
```

## IE 的实现

```js
var xdr = new XDomainRequest()
xdr.onload = function() {
  alert(xdr.responseText)
}
xdr.onerror = function() {
  alert('an error occurred')
}
// 支持timeout属性和ontimeout事件处理程序
xdr.timeout = 1000
xdr.ontimeout = function() {
  alert('Request took too long')
}

xdr.open('get', 'http://www.example.com')
xdr.send(null)
```

## 其他浏览器的实现

FireFox3.5+, Safari4+, Chrome, IOS 的 Safari, android 平台的 webkit 都通过 XMLHtttpRequest 实现了对 CORS 的原生支持

## Preflighted Request

1. 这种请求使用 option 方法,发送一下头部:
   origin: 与简单的请求相同
   Access-Control-Request-Method: 请求自身使用的方法
   Access-Control-Request-Headers: 自定义的头部信息, 多个头部以逗号隔开
2. 发送以上请求之后，服务器可以决定是否允许这种类型的请求，通过在响应中发送如下头部与浏览器进行沟通:
   Access-Control-Allow-Origin: 与简单的请求相同
   Access-Control-Allow-Method: 允许的方法, 多个方法以逗号分隔
   Access-Control-Allow-Headers: 允许的头部, 多个头部以逗号分隔
   Access-Control-Max-Age: 应该将这个 Preflight 请求缓存多长时间

```js
// 一个带有自定义头部NCZ的使用POST方法发送的请求
Origin: http://www.nczonline.net,
Access-Control-Request-Method: POST,
Access-Control-Request-Headers: NCZ
// 发送以上请求之后，服务器可以决定是否允许这种类型的请求，通过在响应中发送如下头部与浏览器进行沟通
Access-Control-Allow-Origin: yu
Access-Control-Allow-Method
```

## 带凭据的请求

## 跨浏览器的 CORS

## Comet(服务器推送)

两种实现方式:

1. 长轮询
2. 流

```js
function createStreamingClient(url, progress, finished) {
  var xhr = new XMLHttpRequest(),
    received = 0
  xhr.open('get', url, true)
  xhr.onreadystatechange = function() {
    var result
    if (xhr.readyState == 3) {
      // 只取得最新数据并调整计数器
      result = xhr.responseText.substring(received)
      received += result.length
      // 调用progress回调函数
      progress(result)
    } else if (xhr.readyState == 4) {
      finished(xhr.responseText)
    }
  }
  xhr.send(null)
  return xhr
}
```

## 服务器发送事件

SSE(server sent event, 服务器发送事件)

## Web Socket
