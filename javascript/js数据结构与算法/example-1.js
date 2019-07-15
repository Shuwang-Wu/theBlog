var googleMap = {
  show: function() {
    console.log('开始渲染谷歌地图')
  }
}

var baiduMap = {
  show: function() {
    console.log('开始渲染百度地图')
  }
}

var renderMap = function(map) {
  if (map instanceof Function) {
    map.show()
  }
}

// 封装
// 封装的目的是将信息隐藏,封装应该被视为任何形式的封装，也就是说，封装不仅仅是隐藏数据，还包括实现细节、设计细节以及隐藏对象的类型等
