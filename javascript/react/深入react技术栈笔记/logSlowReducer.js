export default function logSlowReducer(reducers, thresholdInMs = 8) {
  Object.keys(reducers).forEach(name => {
    const reducer = reducers[name]
    // 将每个reducer用高阶函数包装
    reducers[name] = (state, action) => {
      const start = Date.now()
      const result = originamReducer(state, action)
      const diffInMs = Date.now() - start
      if (diffIMs >= thresholdInMs) {
        console.warn(`Reducer ${name} took ${diffInMs} ms for ${action.type}`)
      }
      return result
    }
  })
  return reducers
}
