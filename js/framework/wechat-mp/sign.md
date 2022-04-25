<!--
 * @Author: Shuwang_wu
 * @Date: 2022-04-25 10:50:41
 * @LastEditTime: 2022-04-25 13:20:23
 * @LastEditors: Shuwang_wu
 * @FilePath: \git\theBlog\js\framework\wechat-mp\sign.md
 * @Description: 微信小程序实现签名功能
-->

# 微信小程序签名功能

## 功能背景
顾客购物之后期望可以签名

## 功能分析
签名功能主要用到画布、横屏展示、签名时需要保证流畅度

## 功能实现步骤
1. 界面设置为横屏
2. 获取界面的宽高
3. 画布的宽高设置为当前窗口的宽高
4. 记录手指在画布上的轨迹
5. 点击确认生成签名并保存
6. 期间需要提供重新绘制功能

## 代码实现
1. js代码
```js
Page({
  data: {
    ctx: null,
    width: null,
    height: null,
    drawCount: 0,
    drawState: "init",
  },
  onShow: function () {
    this.initCanvas();
  },
  initCanvas() {
    let { width, height } = this.data;
    width = wx.getSystemInfoSync().windowWidth;
    height = wx.getSystemInfoSync().windowHeight;
    console.log(wx.getSystemInfoSync());
    this.data.ctx = wx.createCanvasContext("canvas");
    this.setData({
      width,
      height,
    });
    this.clearCanvas();
  },
  clearCanvas() {
    this.data.drawCount = 0;
    this.data.drawState = "ing";
    this.data.ctx.setTextBaseline("top");
    this.data.ctx.setTextAlign("center");
    this.data.ctx.setFontSize(20);
    this.data.ctx.setFillStyle("#616165");
    this.data.ctx.fillText(
      "请灰色区域内完成签名",
      this.data.width / 2,
      this.data.height / 2 - 10
    );
    this.data.ctx.draw(false);
  },
  catchtouchstart(e) {
    if (this.data.drawCount == 0) {
      this.data.ctx.draw(false);
    }
    this.data.drawCount++;
    this.data.ctx.moveTo(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  },
  catchtouchmove(e) {
    if (this.data.drawState == "stop") return;
    this.data.drawState = "ing";
    if (e.touches.length > 1) {
      return;
    }
    this.data.ctx.setStrokeStyle("#000000");
    this.data.ctx.setLineWidth(3);
    this.data.ctx.setShadow(0, 0, 0.5, "#000000");
    this.data.ctx.setLineCap("round");
    this.data.ctx.setLineJoin("round");
    this.data.ctx.lineTo(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
    this.data.ctx.stroke();
    this.data.ctx.draw(true);
    this.data.ctx.moveTo(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  },
  canvasToImg() {
    if (this.data.drawState == "init") return;
    this.data.drawState = "stop";
    wx.canvasToTempFilePath({
      canvasId: "canvas",
      success: (res) => {
        console.log(res.tempFilePath);
        // ...
        // 上传服务器
        wx.navigateTo({
          url: "/pages/showImg/showImg?src=" + res.tempFilePath,
        });
      },
    });
  },
});

```

2. wxss代码 
```wxss
/**index.wxss**/
page{
  position: relative;
  background-color: #f2f2f2;
  width: 100%;
  height: 100%;
}
canvas{
  width: 100%;
  height: 100vh;
}
.btn-reset{
  width: 100rpx;
  position: absolute;
  bottom: 10rpx;
  right: 160rpx;
  padding: 8rpx;
  text-align: center;
  border: 1rpx solid #4965B3;
  color: #4965B3;
  font-size: 18rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
}
.btn-ok{
  width: 100rpx;
  position: absolute;
  bottom: 10rpx;
  right: 30rpx;
  padding: 8rpx;
  text-align: center;
  background-color: #4965B3;
  border: 1rpx solid #4965B3;
  color: #fff;
  font-size: 18rpx;
  border-radius: 8rpx;
  box-sizing: border-box;
}

```
3. wxml代码
```wxml
<canvas canvas-id="canvas" style="width:{{width+'px'}};height:{{height+'px'}}" catchtouchstart="catchtouchstart" catchtouchmove="catchtouchmove" catchtouchend="catchtouchend"></canvas>
<view class="btn-reset" catchtap="clearCanvas">重新绘制</view>
<view class="btn-ok" catchtap="canvasToImg">确认</view>
```
4. json配置
```json
{
  "usingComponents": {},
  "pageOrientation": "landscape"
}
```