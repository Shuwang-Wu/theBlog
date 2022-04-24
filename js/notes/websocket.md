<!--
 * @author       : shuwang.wu@getech.cn
 * @createdDate  : 2021-01-08 15:44:15
 * @version      : 1.0
 * @modifier     : shuwang.wu@getech.cn
 * @modifiedDate : 2021-01-08 17:41:35
 * @reason       : websocket详解
 * @FilePath     : \notes\notes\websocket.md
-->


# websocket 详解

WebSocket 协议在2008年诞生，2011年成为国际标准。所有浏览器都已经支持了。它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

## 特点

1. 建立在 TCP 协议之上，服务器端的实现比较容易。
2. 与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
3. 数据格式比较轻量，性能开销小，通信高效。
4. 可以发送文本，也可以发送二进制数据
5. 没有同源限制，客户端可以与任意服务器通信。
6. 协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。

## 示例
```js
var ws = new WebSocket("wss://echo.websocket.org");  
ws.onopen = function(evt) {   
  console.log("Connection open ...");   
  ws.send("Hello WebSockets!"); 
};  
ws.onmessage = function(evt) {  
  console.log( "Received Message: " + evt.data);  
  ws.close(); 
};  
ws.onclose = function(evt) {  
  console.log("Connection closed."); 
};      
```
## 三、客户端 API

### 1. WebSocket 构造函数
WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例
```js
var ws = new WebSocket('ws://localhost:8080');
```