# OSI 七层模型中，每一层的数据包都是谁生成和解包的？

假定你输入的网址已经 DNS 解析成：1.1.1.1，你本地主机 IP：2.2.2.2

1. STEP1:
   HTTP 层把 client 的数据组织好，称为 data，调用 TCP socket 的连接函数：TCP_connect（1.1.1.1，80）
2. STEP2:

   - TCP client 触发三次同步握手，协商各自的 sequence number，即各自数据第一个字节对应的序列号，这样就可以对发送的每一个字节数据进行编号，方便对方确认；同时还协商 window size，告知对方自己最大的接收缓冲区大小，可以用来进行流量控制，免得对方发送太快而本地没有足够缓冲区而丢弃；在 TCP option 里告知彼此的 MSS，以免引起不必要的 IP 分片，同时还可能协商 SACK，NACK，window scaling ，authentication，分别的作用是减少数据丢包而引起的重传数目，加大 window size，对 TCP Data 进行完整性保护，完成进入 step 2.1。
   - STEP3:
     调用 TCP socket 的发送函数：TCP_send（1.1.1.1，80，data）

3. STEP3:
   TCP 完成 TCP 头、TCP payload 所有字段的封装，称之为 segment，调用 IP 接口函数：IP_send（1.1.1.1，segment )
4. STEP4:
   IP 层检查路由表，决定出口，决定下一跳，通过 ARP 查询下一跳的 MAC，假定为 MAC2；然后 IP 层判定包是否需要分片，如果分片，需要把 TCP segment 做切割成小片处理，假定这里不需要分片，于是 IP 层完成了 IP packet 的所有封装，调用 Ethernet_send ( MAC2, packet)。
5. STEP5:
   网络接口、网卡完成所有的封装，加上 Ethernet header ，所有信息都知道了，source MAC，这个是自己的 MAC，Destination MAC，这个是 MAC2，Ether Protocol:0x0800,然后把计算的校验码 CRC 放入 FCS，形成了 Ethernet Frame。
6. STEP6:
   发连续 7 个字节 preamble：10101010，然后发送 Ethernet frame。 the end!

转载自知乎车小胖的回答

# 在地址栏输入请求地址之后会发生什么 ？
