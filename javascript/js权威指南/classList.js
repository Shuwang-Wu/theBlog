/*eslint-disable*/
/**
 * 如果e有classList属性，则返回它。否则返回一个为e模拟的DOMTockenList API对象
 * 返回的对象有contains add remove toggle toString等方法
 * 来检测和修改元素E的类集合 如果classList是原生支持的
 * 返回的了类数组对象有length和数组索引属性，模拟DOMTockenList不是类数组对象
 * 但是他有一个toArray方法来返回一个含元素类名的纯数组快照
 *  */

function classList(e) {
  if (e.classList) {
    return e.classList
  } else {
    return new CSSClassList(e)
  }
}

function CSSClassList(e) {
  this.e = e
}

CSSClassList.prototype.contains = function(c) {
  if (c.length === 0 || c.indexOf(' ') != -1) {
    throw new Error('Invalid class name: "' + c + '"')
  }

  var classes = this.e.className

  if (!classes) return false

  if (classes === c) return true

  return classes.search('\\b' + c + '\\b') != -1
}

CSSClassList.prototype.add = function(c) {
  if (this.contain(c)) return
  var classes = this.e.className
  if (classes && classes[classes.length - 1] != ' ') {
    c = ' ' + c
  }
  this.e.className += c
}

CSSClassList.prototype.remove = function(c) {
  if (!this.contains(c)) return
  var classes = this.e.classname
  classes.replace(' ' + c, '')
  var pattern = new RegExp('\\b' + c + '\\b\\s*', g)
  classes.replace(pattern, '')
  this.e.classname = classes
}

CSSClassList.prototype.toString = function() {
  return this.e.className
}

CSSClassList.prototype.toArray = function() {
  return this.e.className.match(/\b\w+\b /g) || []
}
