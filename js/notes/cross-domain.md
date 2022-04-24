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

### nginx 代理

#### nginx命令
1. 打开nginx配置文件
  ```bush
  /usr/local/etc/nginx/nginx.conf
  ```
2. 重新加载配置|重启|停止|退出 nginx
  ```bush
  nginx -s reload|reopen|stop|quit
  ```
3. 打开nginx
  ```bush
  nginx
  ```

#### 配置nginx.conf文件
```bush
server {
    # 配置服务地址
    listen       9000;
    server_name  localhost;
    
    # 访问根路径，返回前端静态资源页面
    location / {
        # 前端代码服务地址
        proxy_pass http://localhost:8000/;  #前端项目开发模式下，node开启的服务器，根路径下可打开index.html
    }
    
    # 最简单的API代理配置
    # 约定：所有不是根路径下的资源，都是api接口地址。则可代理如下
    location /* {
        # API 服务地址
        proxy_pass http://www.serverA.com;  #将真正的请求代理到API 服务地址,即真实的服务器地址，ajax的url为/user/1将会访问http://www.serverA.com/user/1
    }
    
    # 需要更改rewrite 请求路径的配置
    location /api/ {
        rewrite ^/api/(.*)$ /$1 break;   #所有对后端的请求加一个api前缀方便区分，真正访问的时候移除这个前缀
        # API Server
        proxy_pass http://www.serverA.com;  #将真正的请求代理到serverA,即真实的服务器地址，ajax的url为/api/user/1的请求将会访问http://www.serverA.com/user/1
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

配置好nginx.config后，做以下操作:
1. 启动nginx服务。终端执行：nginx
2. 前端项目，index.html同级目录起服务，监听8000端口。自然你可以通过http://localhost:8000访问到页面。但是同时，由于访问nginx服务http://localhost:9000的地址，被代理到了http://localhost:8000地址。所以访问http://localhost:9000，也可以访问到此index.html页面。
3. 项目中，所有接口地址为/或者为http:localhost:9000/的都会被代理到http://www.serverA.com/*去访问。从而实现本地开发环境下跨域请求线上http://www.serverA.com的接口。例如ajax的url是/api/user/1，经过代理后发起的请求url是http://www.serverA.com/api/user/1，达到目的，且没有跨域