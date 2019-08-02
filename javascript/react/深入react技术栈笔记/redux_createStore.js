export default function createStore(reducer, initialState, enhancer) {
  // ...
}

//  关于enhancer的实现
if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
  enhancer = initialState
  initialState = undefined
}
if (typeof enhancer !== 'undefined') {
  if (typeof enhancer !== 'function') {
    throw new Error('Expected the enhancer to be a function.')
  }
  return enhancer(createStore)(reducer, initialState)
}
