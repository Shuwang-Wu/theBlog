<!--
 * @author       : shuwang.wu@getech.cn
 * @createdDate  : 2021-01-08 13:14:33
 * @version      : 1.0
 * @modifier     : shuwang.wu@getech.cn
 * @modifiedDate : 2021-01-08 15:29:05
 * @reason       : 关于web-socket的一些知识点收集
 * @FilePath     : \notes\notes\websocket-heartCheck.md
-->

# 关于web socket

## 关于心跳重连的问题
在项目中会出现一些情况导致连接失效而且没有反馈提醒，因此为了保证连接的可持续性和稳定性，所以就需要用到心跳重连

在使用原生websocket的时候，如果设备的网络断开，不会立即触发websocket的任何事件，前端也就无法得知当前连接是否已经断开。这个时候如果调用websocket.send方法。浏览器才会发现连接断了，才会立刻或者短时间内触发onclose事件

后端的websocket地址服务也可能出现异常，造成连接中断，这时候前端也没有接到断开通知，因此需要前端定时发送心跳消息ping之后, 后端接收到ping类型的消息，立马返回pong消息，告知前端连接正常， 如果一段时间没收到pong消息就说明连接不正常， 前端便会执行重连

为了解决这个问题，以前端作为主动方，定时发送ping消息，用于检测网络和前后端连接问题，一旦发现异常，前端持续执行重连逻辑，直到重连成功

## 关于如何实现
```js
var ws = new WebSocket(url)
ws.onopen = function() {
  // do something
}
ws.onerror = function() {
  // do something
}
ws.onclose = function() {
  // do something
}
ws.onmessage = function() {
  // do something
}
```
如果希望一直保持连接, 我们会在close或者error绑定重新连接的方法
```js
ws.onclose=  function() {
  reconnect()
}
ws.onerror=  function() {
  reconnect()
}
```
那么针对断网情况的心跳重连，怎么实现呢，我们只需要定时的发送消息，去触发websocket.send方法，如果网络断开了，浏览器便会触发onclose。
```js
var heartCheck = {
  timeout: 60000, // 60ms
  timeoutObj: null,
  reset: function() {
    clearTimeout(this.timeoutObj)
    this.start()
  },
  start: function() {
    this.timeoutObj = setTimeout(function() {
      ws.send('HeartBeat')
    }, this.timeout)
  } 
}
ws.onopen = function () {
   heartCheck.start();
}
ws.onmessage = function (event) {
    heartCheck.reset();
}
```
如上代码，heartCheck 的 reset和start方法主要用来控制心跳的定时。

### 什么条件下执行心跳
当onopen也就是连接成功后，我们便开始start计时，如果在定时时间范围内，onmessage获取到了后端的消息，我们就重置倒计时，距离上次从后端获取到消息超过60秒之后，执行心跳检测，看是不是断连了，这个检测时间可以自己根据自身情况设定

### 判断前端websocket断开(断网但不限于断网的情况）：
当心跳检测执行send方法之后，如果当前websocket是断开状态(或者说断网了)，发送超时之后，浏览器的websocket会自动触发onclose方法，重连就会立刻执行（onclose方法体绑定了重连事件），如果当前一直是断网状态，重连会2秒（时间是自己代码设置的）执行一次直到网络正常后连接成功。

如此一来，判断前端断开websocket的心跳检测就实现了。为什么说是前端主动断开，因为当前这种情况主要是通过前端websocket.send来检测并触发的onclose，后面说后端断开的情况。

### 不同浏览器的不同问题
1. 在chrome中，如果心跳检测 也就是websocket实例执行send之后，15秒内没发送到另一接收端，onclose便会执行。那么超时时间是15秒。

2. 我又打开了Firefox ，Firefox在断网7秒之后，直接执行onclose。说明在Firefox中不需要心跳检测便能自动onclose。

3.  同一代码， reconnect方法 在chrome 执行了一次，Firefox执行了两次。当然我们在几处地方（代码逻辑处和websocket事件处）绑定了reconnect()，

所以保险起见，我们还是给reconnect()方法加上一个锁，保证只执行一次

目前来看不同的浏览器，有不同的机制，无论浏览器websocket自身会不会在断网情况下执行onclose，加上心跳重连后，已经能保证onclose的正常触发。  其实这是由于socket本身就有底层的心跳，socket消息发送不出去的时候，会等待一定时间看是否能在这个时间之内再次连接上，如果超时便会触发onclose。

### 判断后端断开：

如果后端因为一些情况断开了ws，是可控情况下的话，会下发一个断连的通知，这样会触发前端weboscket的onclose方法，我们便会重连。

如果因为一些异常断开了连接，前端是不会感应到的，所以如果前端发送了心跳一定时间之后，后端既没有返回心跳响应消息，前端也没有收到任何其他消息的话，我们就能断定后端发生异常断开了。

一点特别重要的发送心跳到后端，后端收到消息之后必须返回消息，否则超过60秒之后会判定后端主动断开了。再改造下代码:
```js
var heartCheck = {
    timeout: 60000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
　　　　 this.start();
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            ws.send("HeartBeat");
            self.serverTimeoutObj = setTimeout(function(){
                ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    },
}

ws.onopen = function () {
   heartCheck.start();
};
ws.onmessage = function (event) {
    heartCheck.reset();
}
ws.onclose = function () {
    reconnect();
};
ws.onerror = function () {
    reconnect();
};
```