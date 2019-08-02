function undoable(reducer) {
  const initialState = {
    // 记录过去的state
    past: [],
    // 以一个空的action调用reducer来产生当前值的初始值
    present: reducer(undefined, {}),
    // 记录后续的state
    future: []
  }

  return function(state = initialState, action) {
    const { past, present, future } = state
    switch (action.type) {
      case '@@redux-undo/UNDO':
        const previous = past[past.length - 1]
        const newPast = past.slice(0, past.length - 1)
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        }
      default:
        // 将其他reducer委托给原始的reducer处理
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: []
        }
    }
  }
}

// 有了上面这个高阶reducer，就可以对任意一个reducer进行封装
import { createStore } from 'redux'
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
    // ...
  }
}
const undoableTodos = undoable(todos)
const store = createStore(undoableTodos)

store.dispatch({
  type: 'ADD_TODO',
  text: 'Use Redux'
})

store.dispatch({
  type: 'ADD_TODO',
  text: 'Implement Undo'
})

store.dispatch({
  type: '@@redux-undo/UNDO'
})
