// 从主线程中获取ImageData对象, 对其进行处理并将它传递回去
onmessage = function(e) {
  postMessage(smear(e.data))
}

// 对ImageData中的像素信息香油涂抹, 对其进行处理并将它传递回去
// 对于大图片，此方法会进行大量的计算
// 如果它用在主线程中的话, 很有可能导致无法响应UI的问题
function smear(pixels) {
  var data = pixels.data,
    width = pixels.width,
    height = pixels.height
  // 设置n倍大，用于更多的涂抹
  var n = 0,
    m = n - 1
  // 每一行
  for (row = 0; row < height; row++) {
    // 第二个像素偏移
    var i = row * width * 4 + 4
    // 每一列
    for (var col = 1; col < width; col++, i += 4) {
      // 红色像素分量
      data[i] = (data[i] + data[i - 4] * m) / n
      // 绿色像素分量
      data[i + 1] = (data[i + 1] + data[i - 3] * m) / n
      // 蓝色像素分量
      data[i + 2] = (data[i + 2] + data[i - 2] * m) / n
      // Alpha分量
      data[i + 3] = (data[i + 3] + data[i - 1] * m) / n
    }
  }
  return pixels
}
