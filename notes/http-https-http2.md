<!--
 * @Description  : HTTP1.0、HTTP1.1 和 HTTP2.0 的区别
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-06-23 20:54:48
 * @LastEditTime : 2020-06-24 14:26:55
 * @FilePath     : \notes\notes\http-https-http2.md
-->

# HTTP1.0、HTTP1.1 和 HTTP2.0 的区别

## intro

1. HTTP 是一种能够获取如 HTML 这样的网络资源的 protocol(通讯协议)
2. 它是在 Web 上进行数据交换的基础，是一种 client-server 协议，也就是说，请求通常是由像浏览器这样的接受方发起的。一个完整的 Web 文档通常是由不同的子文档拼接而成的，像是文本、布局描述、图片、视频、脚本等等。

[图示]('../assets/images/http/Fetching_a_page.png')

### http 的基本性质

## HTTP1.0

## HTTP1.1

## HTTPS

## HTTP2.0

### 特点

- 通过以下举措，减少 网络延迟，提高浏览器的页面加载速度

  1. 对 HTTP 头字段进行数据压缩(即 HPACK 算法);
  2. HTTP/2 服务端推送(Server Push);
  3. 请求管线化;
  4. 修复 HTTP/1.0 版本以来未修复的 队头阻塞 问题;
  5. 对数据传输采用多路复用，让多个请求合并在同一 TCP 连接内;

- 新特性

  1. 桢、消息、流和 TCP
     将每个 TCP 连接分成流的形式, 再将每个流分成多个消息, 每个消息再分成桢的形式进行传输
  2. HPACK 算法
     由客户端和服务端共同维护一份动态字典, 字典中收录多个一一对应的哈希码
  3. 允许服务端进行推送 , 无需浏览器在解析页面时针对页面中的资源进行请求, 而由服务端主动推送客户端需要的资源

