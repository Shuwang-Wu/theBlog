/*eslint-disable*/
var CookieUtil = {
  get: function(name) {
    var cookieName = encodeURIComponent(name) + '=',
      cookieStart = document.cookie.indexOf(cookieName),
      cookieValue = null

    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart)
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      )
    }
    return cookieValue
  },
  set: function(name, value, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value)
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires.toGMTString()
    }
    if (path) {
      cookieText += '; path=' + path
    }
    if (domain) {
      cookieText += '; domain=' + domain
    }
    if (secure) {
      cookieText += '; secure'
    }
    document.cookie = cookieText
  },
  unset: function(name, path, domain, secure) {
    this.set(name, '', new Date(0), path, domain, secure)
  }
}

var SubCookieUtil = {
  get: function(name, subName) {
    var subCookies = this.getAll(name)
    if (subCookies) {
      return subCookies[subName]
    } else {
      return null
    }
  },
  getAll: function() {
    var cookieName = encodeURIComponent(name) + '=',
      cookieEnd,
      subCookies,
      cookieValue,
      parts,
      result = {}

    if (document.cookie.indexOf(cookieName) > -1) {
      cookieEnd = document.cookie.indexOf(';', cookieStart)
    }
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length
    }
    cookieValue = decodeURIComponent(
      document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
    )
    subCookies = cookieValue.split('&')
    for (var i = 0; i < subCookies.length; i++) {
      parts = subCookies.split('=')
      result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1])
    }
  },
  set: function(name, subName, value, expires, path, domain, secure) {
    var subcookies = this.getAll(name) || {}
    subcookies[subName] = value
    this.setAll(name, subcookies, expires, path, domain, secure)
  },
  setAll: function(name, subcookies, expires, path, domain, secure) {
    var cookieText = encodeURIComponent(name) + '=',
      subcookieParts = new Array(),
      subName
    for (subName in subcookieParts) {
      if (subName.length > 0 && subcookies.hasOwnproperty(subName)) {
        subcookieParts.push(
          encodeURIComponent(subName) + '=' + encodeURIComponent()
        )
      }
    }
    if (cookieParts.length > 0) {
      cookieText += subcookieParts.join('&')
      if (expires instanceof Date) {
        cookieText += '; expires=' + expires.toGMTString()
      }
      if (path) {
        cookieText += '; path=' + path
      }
      if (domain) {
        cookieText += '; domain=' + domain
      }
      if (secure) {
        cookieText += '; secure'
      }
    } else {
      cookieText += '; expires=' + new Date(0).toGMTString()
    }
    document.cookie = cookieText
  },
  unset: function(name, subName, path, domain, secure) {
    var subcookies = this.getAll(name)
    if (subcookies) {
      delete subcookies[subName]
    }
    this.setAll(name, subcookies, null, path, domain, secure)
  },
  unsetAll: function(name, path, domain, secure) {
    this.setAll(name, null, new Date(0), path, domain, secure)
  }
}
