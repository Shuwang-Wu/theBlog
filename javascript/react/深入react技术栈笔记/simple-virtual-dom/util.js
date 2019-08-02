var _ = exports

_.type = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1)
}

_.isArray = function(arr) {
  return _.type(arr) === 'Array'
}

_.slice = function(arrayLike, index) {
  return Array.prototype.slice.call(arrayLike, index)
}

_.truthy = function(value) {
  return !!value
}

_.each = function(array, fn) {
  for (var i = 0, len = array.length; i < len; i++) {
    fn(array[i], i)
  }
}

_.toArray = function(listLike) {
  if (!listLike) {
    return []
  }
  var list = []

  for (var i = 0, len = listLike.length; i < len; i++) {
    list.push(listLike[i])
  }

  return list
}

_.setAttr = function() {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      var tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value
      } else {
        // if it is not a input or textarea, use `setAttribute` to set
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
      break
  }
}
