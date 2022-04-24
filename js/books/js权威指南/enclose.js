/*eslint-disable*/
// 把内容元素装入到一个指定大小（最小是50X50）的窗体或视口内
// 可选参数是contentX和contentY指定内容相对于窗体的初始偏移量
// 如果指定它们必须<=0
// 这个窗体有mousewheel事件处理程序
// 它允许用户平移和缩放窗体
function enclose() {
  // 这些参数不仅仅是初始值
  // 他们保存当前状态, 能被mousewheel处理程序使用和修改
  //  创建frame元素, 且设置CSS类名和样式
  // 把frame放到文档中, 并把内容移入frame中
  // 确定元素相对于frame的位置
  // 我们将需要针对下面一些特定浏览器怪癖进行处理
  // 注册mousewheel事件处理程序
  function wheelHandler(event) {
    // 查找wheel事件对象, mousewheel事件对象
    // 和fireFox的
  }
}
