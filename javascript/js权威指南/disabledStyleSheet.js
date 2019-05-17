function disabledStyleSheet(ss) {
  if (typeof ss === 'number') {
    document.styleSheet[ss].disabled = true
  } else {
    var sheets = document.querySelectorAll(ss)
    for (var i = 0; i < sheets.length; i++) {
      sheets[i].disabled = true
    }
  }
}
