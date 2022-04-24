/*eslint-disable*/
function fadeOut(e, oncomplete, time) {
  if (typeof e === 'string') e = document.getElementById(e)
  if (!time) time = 500

  var ease = Math.sqrt
  var start = new Date().getTime()

  animate()

  function animate() {
    var elapsed = new Date().getTime() - start
    var fraction = elapsed / time
    if (fraction < 1) {
      var opacity = 1 - ease(fraction)
      e.style.opacity = String(opacity)
      setTimeout(animate, Math.min(25, time - elapsed))
    } else {
      e.style.opacity = '0'
      if (oncomplete) oncomplete(e)
    }
  }
}
