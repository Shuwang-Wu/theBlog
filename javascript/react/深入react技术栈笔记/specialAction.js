const specialActions = (reducer, reg, actions) => {
  return (state, action) => {
    if (actions.indexOf(action.type) !== -1) {
      return reducer(state)
    }
    if (action.type.match(reg)) {
      return reducer(state)
    }
    return state
  }
}
combineReducers({
  counter: specialActions(counter, /COUNTER$/, [SELECT_RADIO]),
  radio: specialActions(radio, /RADIO$/, [INCREMENT_COUNTER])
})
