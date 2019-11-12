/*eslint-disable*/
/**
 * 当文档准备就绪时调用函数
 * 传递参数给whenReady(), 当文档解析完毕且为操作准备就绪时
 * 函数将作为文档对象的方法调用
 * DOMContentLoaded, readystatechange或load事件发生时会触发注册函数
 * 一旦文档准备就绪, 所有函数都将被调用, 任何传递给whenReady()的函数都将立即调用
 *  */

var whenReady = (function() {
  // 这个函数返回whenReady函数
  var funcs = [] // 当获得事件时, 要运行的函数
  var ready = false // 当触发事件时, 切换到true

  // 当文档准备就绪时, 调用事件处理程序
  function handler(e) {
    // 如果已经运行过一次, 只需要返回
    if (ready) return
    // 如果发生readystatechange事件但其状态不是complete, 那么文档并未准备好
    if (e.type === 'readystatechange' && document.readyState !== 'complete')
      return
    // 运行所有注册函数 注意每次都要计算funcs.length 以防这些函数的调用会导致注册更多的函数
    for (var i = 0; i < funcs.length; i++) {
      funcs[i].call(document)
    }
    // 现在设置ready表示为true, 并移除所有函数
    ready = true
    funcs = null
  }

  // 为接收到的任何事件注册处理程序
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false)
    document.addEventListener('readystatechange', handler, false)
    window.addEventListener('load', handler, false)
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler)
    window.attachEvent('onload', handler)
  }

  // 返回whenReady函数
  return function whenReady(f) {
    // 若准备完毕就运行 否则加入队列
    if (ready) {
      f.call(document)
    } else {
      funcs.push(f)
    }
  }
})()
