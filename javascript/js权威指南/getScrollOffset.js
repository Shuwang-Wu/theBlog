// 查询窗口滚动条的位置
function getScrollOffset(w) {
  // 使用指定的窗口, 如果不带参数则使用当前窗口
  w = w || window
  // 除了IE8及更早的版本外, 其他浏览器都在用
  if (w.pageXOffset != null) {
    return { x: w.pageXOffset, y: w.pageYOffset }
  }
  // 针对标准模式下的IE
  var d = w.document
  if (document.compatMode == 'CSS1Compat') {
    return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop }
  }

  return { x: d.body.scrollLeft, y: d.body.scrollTop }
}

/**
 * getBoundingClientRect
 * 不需要传入参数
 * @return {left, right, bottom, top}
 * left top 表示左上角的xy
 * right bottom 表示右下角的xy
 *  */
var box = e.getBoundingClientRect()
var offsets = getScrollOffsets()
var x = box.left + offsets.x
var y = box.top + offsets.y

// 计算元素的宽高
var box = e.getBoundingClientRect()
var w = box.width || box.right - box.left
var w = box.height || box.bottom - box.top

// 判断元素在某点
elementFromPoint
