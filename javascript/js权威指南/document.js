function parent(e, n) {
  if (n === undefined) n = 1
  while (n-- && e) e = e.parentNode
  if (!e || e.nodeType !== 1) return null
  return e
}

// 详细查看书本内容
