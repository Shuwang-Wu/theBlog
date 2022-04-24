/*eslint-disable*/
// 自动切换焦点
;(function() {
  function tabFoward(event) {
    event = EventUtil.getEvent(event)
    var target = EventUtil.getTarget(event)
    if (target.value.length == target.maxLength) {
      var form = target.form
      for (var i = 0; i < form.elements.length; i++) {
        if (form.elements[i] == target) {
          if (form.elements[i + 1]) {
            form.elements[i + 1].focus()
          }
          return
        }
      }
    }
  }

  var textbox1 = document.getElementById('textbox1')
  var textbox2 = document.getElementById('textbox2')
  var textbox3 = document.getElementById('textbox3')

  console.log(textbox1, textbox2, textbox3)

  EventUtil.addHandler(textbox1, 'keyup', tabFoward)
  EventUtil.addHandler(textbox2, 'keyup', tabFoward)
  EventUtil.addHandler(textbox3, 'keyup', tabFoward)
})()
