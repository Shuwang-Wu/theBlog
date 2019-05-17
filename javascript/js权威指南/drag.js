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
    return {
      x: d.documentElement.scrollLeft,
      y: d.documentElement.scrollTop
    }
  }

  return { x: d.body.scrollLeft, y: d.body.scrollTop }
}

/**
 * @func {drag}
 * @param {elementToDrag: Element} Element Object to drag
 * @param {event: func} handle function
 * @return undefined
 */
function drag(elementToDrag, event) {
  // get element scroll offset
  var scroll = getScrollOffset()
  var startX = event.clientX + scroll.x // position by document
  var startY = event.clientY + scroll.y // position by document

  var origX = elementToDrag.offsetLeft // element original position
  var origY = elementToDrag.offsetTop // element original position

  // the distance form element to event position
  var deltaX = startX - origX
  var deltaY = startY - origY

  // handle addEventListener
  if (document.addEventListener) {
    document.addEventListener('mouseover', moveHandler, true)
    document.addEventListener('mouseup', upHandler, true)
  } else if (document.attachEvent) {
    elementToDrag.setCapture()
    elementToDrag.attachEvent('onmousemove', moveHandler)
    elementToDrag.attachEvent('onmouseup', upHandler)
    elementToDrag.attachEvent('onlosecapture', upHandler)
  }

  // handle propagation
  if (event.stopPropagation) {
    event.stopPropagation()
  } else {
    event.cancelBubble = true
  }

  // handle preventDefault
  if (event.preventDefault) {
    event.preventDefault()
  } else {
    event.returnValue = false
  }

  // move handler
  function moveHandler(e) {
    if (!e) e = window.event
    var scroll = getScrollOffset()
    elementToDrag.style.left = e.clientX + scroll.x - deltaX + 'px'
    elementToDrag.style.top = e.clientY + scroll.y - deltaY + 'px'
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }

  // up upHandler
  function upHandler(e) {
    if (!e) e = window.event
    if (document.removeEventListener) {
      document.removeEventListener('mouseover', moveHandler, true)
      document.removeEventListener('mouseup', upHandler, true)
    } else if (document.attachEvent) {
      elementToDrag.detachEvent('onlosecapture', upHandler)
      elementToDrag.detachEvent('onmouseup', upHandler)
      elementToDrag.detachEvent('onmousemove', moveHandler)
      elementToDrag.releaseCapture()
    }
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
}
