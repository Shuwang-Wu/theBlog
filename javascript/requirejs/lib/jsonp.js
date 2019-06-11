/**
 * jsonp实现原理
 * 思路：插入script标签，借用其可以进行跨域请求的特性来达到这一目的
 */
;(function(global) {
  var id = 0,
    container = document.getElementsByTagName('head')[0]
  function jsonp(options) {
    if (!options || !options.url) return
    var scriptNode = document.createElement('script'),
      data = options.data || {},
      url = oprions.url,
      callback = options.callback,
      fnName = 'jsonp' + id++

    // 添加回调函数
    data['callback'] = fnName

    // 拼接url
    var params = []
    for (var key in data) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    }
    url = url.indexOf('?') > 0 ? url + '&' : url + '?'
    url += params.join('&')
    scriptNode.src = url

    // 传递的是一个匿名的回调函数，要执行的话，暴露一个全局方法
    global[fnName] = function(ret) {
      callback && callback(ret)
      container.removeChild(scriptNode)
      delete global[fnName]
    }

    // 出错处理
    scriptNode.onerror = function() {
      callback && callback({ error: 'error' })
      container.removeChild(scriptNode)
      global[fnName] && delete global[fnName]
    }

    scriptNode.type = 'text/javascript'
    container.appendChild(scriptNode)

    global.jsonp = jsonp
  }
})(this)

// 使用实例
jsonp({
  url: 'www.example.com',
  data: { id: 1 },
  callback: function(ret) {
    console.log(ret)
  }
})
