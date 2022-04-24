/*eslint-disable*/
const REACTPATCH = {
  processUpdates: function(parentNode, updates) {
    // 处理新增节点、移动的节点以及需要移除的节点
    for (var k = 0; k < updates.length; k++) {
      var update = updates[k]
      switch (update.type) {
        // 插入新的节点
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertLazyTreeChildAt(
            parentNode,
            update.content,
            getNodeAfter(parentNode, update.afterNode)
          )
          break
        // 需要移动的节点
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          moveChild(
            parentNode,
            update.fromNode,
            getNodeAfter(parentNode, update.afterNode)
          )
          break
        case ReactMultiChildUpdateTypes.SET_MARKUP:
          setInnerHTML(parentNode, update.content)
          break
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          setTextContent(parentNode, update.content)
          break
        // 需要删除的节点
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          removeChild(parentNode, update.fromNode)
          break
      }
    }
  }
}

function getNodeAfter(parentNode, node) {
  // 文本组件的返回格式 [open, close] comments，需要做特殊处理
  if (Array.isArray(node)) {
    node = node[1]
  }
  return node ? node.nextSibling : parentNode.firstChild
}

// 插入新节点的操作
function insertLazyTreeChildAt(parentNode, childTree, referenceNode) {
  DOMLazyTree.insertTreeBefore(parentNode, childTree, referenceNode)
}

// 移动已有节点的操作
function moveChild(parentNode, childNode, referenceNode) {
  if (Array.isArray(childNode)) {
    moveDelimitedText(parentNode, childNode[0], childNode[1], referenceNode)
  } else {
    insertChildAt(parentNode, childNode, referenceNode)
  }
}

// 移除已有节点的操作
function removeChild(parentNode, childNode) {
  if (Array.isArray(childNode)) {
    var closingComment = childNode[1]
    childNode = childNode[0]
    removeDelimitedText(parentNode, childNode, closingComment)
    parentNode.removeChild(closingComment)
  }
  parentNode.removeChild(childNode)
}

// 文本组件需要去除 openingComment 和 closingComment，取得其中的 node
function moveDelimitedText(
  parentNode,
  openingComment,
  closingComment,
  referenceNode
) {
  var node = openingComment
  while (true) {
    var nextNode = node.nextSibling
    insertChildAt(parentNode, node, referenceNode)
    if (node === closingComment) {
      break
    }
    node = nextNode
  }
}

function removeDelimitedText(parentNode, startNode, closingComment) {
  while (true) {
    var node = startNode.nextSibling
    if (node === closingComment) {
      // closingComment 已经被 ReactMultiChild 移除
      break
    } else {
      parentNode.removeChild(node)
    }
  }
}
