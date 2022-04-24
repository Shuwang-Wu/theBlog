/*eslint-disable*/
function createXHR() {
  if (typeof XMLHttpRequest != 'undefined') {
    return new XMLHttpRequest()
  } else if (typeof ActiveXObject != 'undefined') {
    if (typeof arguments.callee.activeXString != 'string') {
      var versions = [
          'MSXML2.XMLHttp.6.0',
          'MSXML2.XMLHttp.3.0',
          'MSXML2.XMLHttp'
        ],
        i,
        len
      for (var i = 0, len = versions.length; i < len; i++) {
        try {
          new ActiveXObject(versions[i])
          arguments.callee.activeXString = versions[i]
        } catch (ex) {
          // 跳过
        }
      }
    }
    return new ActiveXObject(arguments.callee.activeXString)
  } else {
    throw new Error('No XHR object available')
  }
}
