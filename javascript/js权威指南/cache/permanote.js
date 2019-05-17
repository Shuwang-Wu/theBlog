var editor, statusline, savebutton, idletimer

window.onload = function() {
  // 第一次载入时, 初始化本地存储
  if (localStorage.note == null) {
    localStorage.note = ''
  }
  if (localStorage.lastModified == null) {
    localStorage.lastModified = 0
  }
  if (localStorage.lastSaved == null) {
    localStorage.lastSaved = 0
  }

  // 查找编辑器元素, 并初始化全局变量
  editor = document.getElementById('editor')
  statusline = document.getElementById('statusline')
  savebutton = document.getElementById('savebutton')
}
// ...
//  查看js权威指南 page618
