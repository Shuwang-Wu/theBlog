/*eslint-disable*/
function createCORSRequest() {
  var xhr = new XMLHttpRequest()
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true)
  } else if (typeof XDomainRequest != 'undefined') {
    vxhr = new XDomainRequest()
    xhr.open(method, url)
  } else {
    xhr = null
  }
  return xhr
}

var request = createCORSRequest('get', 'http://www.somewebsite.com')
if (request) {
  request.onload = function() {
    // 对request.responseText进行处理
  }
  request.send()
}
