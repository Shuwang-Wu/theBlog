var insert = function() {
  if (document.createElement('div').insertAdjacentHTML) {
    return {
      before: function(e, h) {
        e.insertAdjacentHTML('beforebegin', h)
      },
      after: function(e, h) {
        e.insertAdjacentHTML('afterend', h)
      },
      atStart: function(e, h) {
        e.insertAdjacentHTML('afterbegin', h)
      },
      atEnd: function(e, h) {
        e.insertAdjacentHTML('beforeend', h)
      }
    }
  }

  function fragment(html) {
    var elt = document.createElement('div')
    var frag = document.createDocumentFragment()
    elt.innerHTML = html
    while (elt.firstChild) {
      frag.appendChild(elt.firstChild)
    }
    return frag
  }

  var insert = {
    before: function(elt, html) {
      elt.parentNode.insertBefore(fragment(html), elt)
    },
    after: function(e, h) {
      elt.parentNode.insertBefore(fragment(html), elt.nextSibling)
    },
    atStart: function(e, h) {
      e.insertBefore(fragment(html), elt.firstChild)
    },
    atEnd: function(e, h) {
      e.appendChild(fragment(html))
    }
  }

  Element.prototype.insertAdjacentHTML = function(pos, html) {
    switch (pos.toLowerCase()) {
      case 'beforebegin':
        return insert.before(this, html)
      case 'afterend':
        return insert.after(this, html)
      case 'afterbegin':
        return insert.atStart(this, html)
      case 'beforeend':
        return insert.atEnd(this, html)
      default:
        return false
    }
  }

  return Insert
}
