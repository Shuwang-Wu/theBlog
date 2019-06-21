/**
 * @module event_util.js
 * @method {addHandler} 添加事件处理程序
 * @method {removeHandler} 移除事件处理程序
 * @param {element} 监听事件的目标元素
 * @param {type} 监听的事件类型
 * @param {handler} 监听的事件处理程序
 * @method {getEvent} 获取事件对象本身
 * @method {getTarget} 获取触发事件目标对象
 * @method {preventDefault} 取消事件默认行为
 * @method {stopPropagation} 取消事件冒泡
 * @param {event} 事件对象
 * @author {wsw}
 * @desc last modified on 2018/05/28
 * */

var EventUtil = {
  addHandler: function(element, type, handler) {
    if (window.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (window.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler: function(element, type, handler) {
    if (window.removeEventListener) {
      element.addEventListener(type, handler, false)
    } else if (window.detachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  },
  getEvent: function(event) {
    return event ? event : window.event
  },
  getTarget: function(event) {
    return event.target || event.srcElement
  },
  preventDefault: function(event) {
    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }
  },
  stopPropagation: function(event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  getRelatedTarget: function() {
    if (event.relatedTarget) {
      return event.relatedTarget
    } else if (event.toElement) {
      return event.toElement
    } else if (event.fromElement) {
      return event.fromElement
    } else {
      return null
    }
  },
  // 在mouseup,mousedown的event对象中包含button属性
  getButton: function(event) {
    if (document.implementation.hasFeature('MouseEvents', '2.0')) {
      return event.button
    } else {
      switch (event.button) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
          return 1
        case 5:
          return 2
        case 6:
        case 7:
          return 0
      }
    }
  },
  getWheelDelta: function(event) {
    if (event.getWheelDelta) {
      return client.engine.opera && client.engine.opera < 9.5
        ? -event.getWheelDelta
        : event.getWheelDelta
    } else {
      return -event.detail * 40
    }
  },
  getCharCode: function(event) {
    if (typeof event.charCode == 'number') {
      return event.charCode
    } else {
      return event.keyCode
    }
  },
  getClipboardText: function(event) {
    var clipboardData = event.clipboardData || window.clipboardData
    return clipboardData.getData('text')
  },
  setClipboardData: function() {
    if (event.clipboardData) {
      return event.clipboardData.setData('text/plain', value)
    } else if (window.clipboardData) {
      return window.clipboardData.setData('text', value)
    }
  }
}
