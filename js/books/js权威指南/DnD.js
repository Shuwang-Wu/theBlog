/*eslint-disable*/
var whenReady = (function() {
  var funcs = []
  var ready = false

  function handler(e) {
    if (ready) return

    if (e.type === 'readystatechange' && document.readyState !== 'complete')
      return

    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document)
    }
    ready = true
    funcs = null
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false)
    document.addEventListener('readystatechange', handler, false)
    window.addEventListener('load', handler, false)
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler)
    window.attachEvent('onload', handler)
  }

  return function whenReady(f) {
    if (ready) f.call(document)
    else funcs.push(f)
  }
})()

/**
 * DnD API相当复杂, 且浏览器也不完全兼容
 * 这个例子基本正确, 但每个浏览器会有一点不同，每个似乎都有自身独有的bug
 * 这些代码不会舱室浏览器特有的解决方案
 * */
// 当文档准备就绪时运行这个函数
whenReady(function() {
  // 查找所有的<ul class='dnd'>元素，并对其调用dnd函数
  var lists = document.getElementsByTagName('ul')
  var regexp = /\bdnd\b/
  for (var i = 0; i < lists.length; i++) {
    if (regexp.test(lists[i].className)) dnd(lists[i])
  }

  function dnd(list) {
    // 保存原始css类
    var original_class = list.className
    // 跟踪进入和离开
    var entered = 0

    // 当拖放对象首次进入列表时调用这个处理程序
    // 它会检查拖放对象包含的数据格式它是否能处理
    // 如果能, 它返回false来表示有兴趣放置
    // 在这种情况下， 它会高亮拖放目标，让用户知道该兴趣
    list.ondragenter = function(e) {
      e = e || window.event

      var from = e.relatedTarget
      // dragenter和dragleave事件冒泡
      // 它使得像在ul元素有li子元素的情况下，何时高亮显示或取消显示元素变的棘手
      // 在定义relatedTarget的浏览器中, 我们能跟踪它
      // 否则我们需要统计进入和离开的次数
      // 如果从列表外面进入或第一次进入
      // 那么需要做一些处理
      entered++
      if ((from && !ischild(from, list)) || entered == 1) {
        // 所有DnD信息都在dataTransfer对象上
        var dt = e.dataTransfer

        // dt.types对象列出可用的拖放数据的类型或格式
        // 在HTML定义这个对象有contain()方法
        // 在一些浏览器中，它是一个有indexOf()方法的数组
        // 在IE以及之前版本中, 它根本不存在
        var types = dt.types

        // 如果没有任何类型的数据或可用数据是纯文本格式
        // 那么高亮显示列表让用户知道我们正在监听拖放
        // 同时返回false让浏览器知晓
        if (
          !types || // IE
          (types.contains && types.contains('text/plain')) || // HTML5
          (types.indexOf && types.indexOf('text/plain') != -1) // webkit
        ) {
          list.className = original_class + ' droppable'
          return false
        }

        // 如果我们无法识别数据类型, 我们不希望拖放
        return // 没有取消
      }

      // 如果不是第一次进入 继续保持兴趣
      return false
    }

    // 当鼠标悬停在列表上, 会调用这个处理程序
    // 我们必须定义这个处理程序并返回false，否则这个拖放动作将取消
    list.ondragover = function(e) {
      return false
    }

    // 当拖放对象移除列表或者子元素中移出时，会调用这个处理程序
    // 如果我们真正离开这个列表（不是仅仅从一个列表项到另一个）
    // 那么取消高亮显示它
    list.ondragleave = function(e) {
      var e = e || window.event
      var to = e.relatedTarget

      // 如果我们需要到列表以外的元素或打破离开和进入次数的平衡
      // 那么取消高亮显示列表
      entered--
      if ((to && !ischild(to, list)) || entered <= 0) {
        list.className = original_class
        entered = 0
      }
      return false
    }

    // 当我们实际放置时，会调用这个程序
    // 我们接受放下的文本并将其放到一个新的li元素中
    list.ondrop = function(e) {
      e = e || window.event
      // 获得放置的纯文本数据
      // 'Text'是'text/plain'的昵称
      // IE不支持text/plain,所以在这里使用text
      var dt = e.dataTransfer
      var text = dt.getData('text')

      // 如果得到一些文本, 把它放入列表尾部的新项中
      if (text) {
        var item = document.createElement('li')
        item.draggable = true
        item.appendChild(document.createTextNode(text))
        list.appendChild(item)

        // 回复列表的原始样式且重置进入次数
        list.className = original_class
        entered = 0

        return false
      }
    }

    var items = list.getElementsByTagName('li')
    for (var i = 0; i < items.length; i++) {
      items[i].draggable = true

      // 为拖动列表项注册事件处理程序
      // 注意我们把处理程序放在列表上
      // 让事件从列表项向上冒泡

      // 当在列表中开始拖动对象，会调用这个处理程序
      list.ondragstart = function() {
        var e = e || window.event
        var target = e.target || e.srcElement
        if (target.tagName !== 'LI') {
          return false
        }

        var dt = e.dataTransfer
        // 设置拖动的数据和数据类型
        dt.setData('Text', target.innerText || target.textContent)
        // 设置允许复制和移动这些数据
        dt.effectAllowed = 'copyMove'
      }

      // 当成功的放置后，将调用这个处理程序
      list.ondragend = function(e) {
        e = e || window.event
        var target = e.target || e.srcElement

        // 如果这个拖放操作是move，那么要删除列表项
        // IE8中, 它将是none，除非在之前的ondrop处理程序中显示设置它为move
        // 但为IE强制设置move会阻止其他浏览器给用户选择复制还是移动的机会
        if (e.dataTransfer.dropEffect === 'move') {
          target.parentNode.removeChild(target)
        }
      }
    }
    function ischild(a, b) {
      for (; a; a = a.parentNode) {
        if (a === b) {
          return true
        }
      }
      return false
    }
  }
})
