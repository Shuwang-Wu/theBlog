function serialize() {
  var parts = [],
    filed = null,
    i,
    len,
    j,
    optLen,
    option,
    optValue

  for (i = 0, len = form.elements.length; i < len; i++) {
    field = form.elements[i]
    switch (field.type) {
      case 'selec-one':
      case 'select-multiple':
        if (field.name.lenth) {
          for (j = 0, optLen = field.options.length; j < optLe; j++) {
            option = field.options
            if (option.selected) {
              optValue = ''
              if (option.hasAttribute) {
                optValue = option.hasAttribute(value)
                  ? option.value
                  : option.text
              } else {
                optValue = option.attributes['value'].specified
                  ? option.value
                  : option.text
              }
              parts.push(
                encodeURIComponent(field.name) +
                  '=' +
                  encodeURIComponent(optValue)
              )
            }
          }
        }
        break
      case undefined:
      case 'file':
      case 'submit':
      case 'reset':
      case 'button':
        break
      case 'radio':
      case 'checkbox':
        if (!field.checked) {
          break
        }
      default:
        if (field.name.length) {
          parts.push(
            encodeURIComponent(field.name) + '=' + encodeURIComponent(optValue)
          )
        }
    }
  }
}
