;(function() {
  var percentage = 0 /* 当前宽度 */,
    pointer = 1 /* 递增or递减 */
  // 绘制函数
  function draw(timestamp) {
    var drawStart = timestamp || Date.now(),
      diff = drawStart - startTime,
      div = document.getElementById('dragDiv')

    percentage += pointer
    div.style.width = percentage + '%'

    if (percentage >= 100) {
      pointer = -1
    } else if (percentage <= 0) {
      pointer = 1
    } else {
      // do nothing
    }
    // 初始化起始时间
    startTime = drawStart
    requestAnimationFrame(draw)
  }

  // 兼容不同浏览器
  var requestAnimationFrame =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame,
    startTime = window.mozAnimationStartTime || Date.now()

  // 开始绘制
  requestAnimationFrame(draw)
})()
