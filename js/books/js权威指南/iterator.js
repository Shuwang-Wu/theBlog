/*eslint-disable*/
// 迭代器的特点是每次调用next都会返回集合中的下一个值
function counter(start) {
  let nextValue = start
  return {
    next: function() {
      return nextValue++
    }
  }
}
// 当遍历完所有值并且没有多余的值可迭代时, 再调用next会返回StopIteration
// StopIteration是JavaScript 1.7中的全局对象的属性 是一个普通的对象 只是为了终结迭代的目的而保留的一个对象
// javascrpt 权威指南11章
