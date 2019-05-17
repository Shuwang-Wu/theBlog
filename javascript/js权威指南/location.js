// url parameters tranform to object
function urlArgs() {
  var urlArgs = {}
  var query = location.search.substring(1)
  var pairs = query.split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=')
    if (pos === -1) continue
    var name = pairs[i].substring(0, pos)
    var value = pairs[i].substring(pos)
    urlArgs[name] = value
  }
  return urlArgs
}
