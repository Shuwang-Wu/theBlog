/**
 *
 * @param {vNode} el 将要挂载到Dom树的html标签
 * @param {Object} vm 传入新建的SelfVue实例
 */
function Compile(el, vm) {
  // vm 指的是new出来的SelfVue实例
  this.vm = vm
  // 查找到将要挂载的元素
  this.el = document.querySelector(el)
  // 新建代码片段来进行更改, 避免多次修改带来Dom的开销, 进而增加渲染的时间
  this.fragment = null
  // 初始化
  this.init()
}

/**
 * @desc 对Compile对象的原型添加方法
 * @method init 初始化编译
 * @method nodeToElement 初始化编译
 * @method compile 编译模版文件, 针对不同的元素节点采用不同的编译方法
 * @method compileElement 编译Dom元素
 * @method compileModel 编译v-model指令
 * @method compileText 编译文本节点
 * @method compileEvent 编译v-bind指令绑定的方法
 * @method modelUpdater 渲染当前更新
 * @method updateText  判断当前文本是否为空, 并返回指定的文本
 * @method isDerective 判断是否为指令
 * @method isEventDirective 是否为事件指令
 * @method isElementNode 是否是元素节点
 * @method isTextNode 是否是文本节点
 */
Compile.prototype = {
  init: function() {
    // 如果挂载的元素存在
    if (this.el) {
      // 创建了一个虚拟的Dom节点, 并将原来挂载在真实的DOM节点上的元素挂载到虚拟节点上面
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    } else {
      throw new Error('Dom 元素不存在！')
    }
  },
  nodeToFragment: function(el) {
    // 新建虚拟Dom节点
    var fragment = document.createDocumentFragment()

    // 取出原来挂载到真是DOM节点上的子节点, 并逐一挂载到虚拟节点上来进行更新
    var child = el.firstChild

    while (child) {
      // 当使用appendChild成功添加后，该节点会从原来的节点上移除
      fragment.appendChild(child)
      // 所以这里每次都是不同的元素
      child = el.firstChild
    }

    return fragment
  },
  compileElement: function(el) {
    // 获取当前挂载元素的所有子节点
    var childNodes = el.childNodes
    var self = this

    // 将当前子节点的类数组集合转化成数组
    // 遍历当前子节点组成的数组来进行解析
    ;[].slice.call(childNodes).forEach(node => {
      // 声明正则表达式来解析模版数据
      var reg = /\{\{(.*)\}\}/

      // 获取文本节点的文本内容
      var text = node.textContent
      // 判断是否为元素节点
      if (self.isElementNode(node)) {
        self.compile(node)
        // 判断是否为文本节点
      } else if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, reg.exec(text)[1])
      }

      // 当前子节点存在自己的子节点, 递归遍历出来当前子节点中包含的子节点
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node)
      }
    })
  },
  compile: function(node) {
    // 获取当前节点所有属性值组成的数组
    var nodeAttrs = node.attributes
    var self = this

    // 根据获取到的子节点来
    nodeAttrs.length > 0 &&
      Array.prototype.forEach.call(nodeAttrs, function(attr) {
        // 获取当前属性的key
        var attrName = attr.name

        // 判断当前属性是否为指令
        if (self.isDerective(attrName)) {
          // 获取属性值
          var exp = attr.value
          var dir = attrName.substring(2)
          if (self.isEventDirective(dir)) {
            self.compileEvent(node, self.vm, exp, dir)
          } else {
            self.compileModel(node, self.vm, exp, dir)
          }
          node.removeAttribute(attrName)
        }
      })
  },
  compileText: function(node, exp) {
    exp = exp.trim()
    var self = this
    var initText = this.vm.data[exp]
    this.updateText(node, initText)
    new Watcher(this.vm, exp, function(value) {
      self.updateText(node, value)
    })
  },
  compileEvent: function(node, vm, exp, dir) {
    var eventType = dir.split(':')[1]
    var cb = vm.methods && vm.methods[exp]
    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false)
    }
  },
  compileModel: function(node, vm, exp, dir) {
    var self = this
    var val = this.vm[exp]
    this.modelUpdater(node, val)
    new Watcher(this.vm, exp, function(value) {
      self.modelUpdater(node, value)
    })

    node.addEventListener('input', function(e) {
      var newVal = e.target.value
      if (val === newVal) {
        return
      }
      self.vm[exp] = newVal
      val = newVal
    })
  },
  modelUpdater: function(node, value) {
    node.value = typeof value === 'undefined' ? '' : value
  },
  updateText: function(node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },
  /**
   * nodeType 补充说明
   * @type {Node.ELEMENT_NODE} 1	An Element node like <p> or <div>
   * @type {Node.TEXT_NODE}	3	The actual Text inside an Element or Attr
   * @type {Node.CDATA_SECTION_NODE}	4	A CDATASection, such as <!CDATA[[ … ]]>
   * @type {Node.PROCESSING_INSTRUCTION_NODE}	7	A ProcessingInstruction of an XML document, such as <?xml-stylesheet … ?>.
   * @type {Node.COMMENT_NODE}	8	A Comment node, such as <!-- … -->.
   * @type {Node.DOCUMENT_NODE}	9	A Document node
   * @type {Node.DOCUMENT_TYPE_NODE}	10	A DocumentType node, such as <!DOCTYPE html>。
   * @type {Node.DOCUMENT_FRAGMENT_NODE}	11	A DocumentFragment node
   * */
  isDerective: function(attr) {
    return attr.indexOf('v-') === 0
  },
  isEventDirective: function(dir) {
    return dir.indexOf('on:') === 0
  },
  isElementNode: function(node) {
    return node.nodeType === 1
  },
  isTextNode: function(node) {
    return node.nodeType === 3
  }
}
