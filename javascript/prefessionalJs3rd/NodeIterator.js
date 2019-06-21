var div = document.getElementById('div1')
var filter = {
  acceptNode: function() {
    return node.tagName.toLowerCase() == 'p'
      ? NodeFilter.FILTER_ACCEPT
      : NodeFilter.FILTER_SKIP
  }
}
var iterator = document.createNodeIterator(
  div,
  NodeFilter.SHOW_ELEMENT,
  null,
  false
)
var node = iterator.nextNode()
while (node !== null) {
  alert(node.tagName)
  node = iterator.nextNode()
  console.log(node)
}
