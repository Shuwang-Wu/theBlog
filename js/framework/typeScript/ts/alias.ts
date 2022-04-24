type name = string
type nameResolve = () => string
type nameOrResolve = name | nameResolve
function getName(n: nameOrResolve): name {
  if (typeof n === 'string') {
    return n
  } else {
    return n()
  }
}

type eventName = 'click' | 'mousemove' | 'scroll'
function handleEvent(ele: Element, event: EventNames) {
  // do something...
}
