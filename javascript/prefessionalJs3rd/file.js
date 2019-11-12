/*eslint-disable*/
// 第一种
var fileList = document.getElementById('file-list')
EventUtil.addHandler(fileList, 'change', function(event) {
  var files = EventUtil.getTarget(event).files,
    i = 0,
    len = files.length
  console.log(files, 123456)
  while (i < len) {
    console.log(
      files[i].name + ' (' + files[i].type + ', ' + files[i].size + ' bytes)'
    )
    i++
  }
})

// 第二种 FileReader类型
EventUtil.addHandler(fileList, 'change', function(event) {
  var info = '',
    output = document.getElementById('output'),
    progress = document.getElementById('progress'),
    type = 'default',
    files = EventUtil.getTarget(event).files,
    reader = new FileReader(),
    url = createObjectURL(files[0])

  if (/image/.test(files[0].type)) {
    reader.readAsDataURL(files[0])
    type = 'image'
  } else {
    reader.readAsText(files[0])
    type = 'text'
  }
  reader.onerror = function() {
    output.innerHTML =
      'Could not read file, error code is: ' + reader.error.code
  }
  reader.onprogress = function(event) {
    if (event.lengthComputable) {
      progress.innerHTML = event.loaded / event.total
    }
  }
  reader.onload = function() {
    var html = ''
    switch (type) {
      case 'image':
        html = '<img src="' + reader.result + '"/>'
        break
      case 'text':
        html = reader.result
        break
    }
    output.innerHTML = html
  }
})

// 第三种 通过createObjectURL直接读取图片url
function createObjectURL(blob) {
  if (window.URL) {
    return window.URL.createObjectURL(blob)
  } else if (window.webkitURL) {
    return window.webkitURL.createObjectURL(blob)
  } else {
    return null
  }
}
EventUtil.addHandler(fileList, 'change', function(event) {
  var info = '',
    output = document.getElementById('output'),
    progress = document.getElementById('progress'),
    type = 'default',
    files = EventUtil.getTarget(event).files,
    reader = new FileReader(),
    url = createObjectURL(files[0])
  console.log(url, 1001)
  if (url) {
    if (/image/.test(files[0].type)) {
      output.innerHTML = "<img src='" + url + "'/>"
    } else {
      output.innerHTML = 'Not an image'
    }
  } else {
    output.innerHTML = 'Your browser don not support Obeject url'
  }
  reader.onerror = function() {
    output.innerHTML =
      'Could not read file, error code is: ' + reader.error.code
  }
  reader.onprogress = function(event) {
    if (event.lengthComputable) {
      progress.innerHTML = event.loaded / event.total
    }
  }
})
