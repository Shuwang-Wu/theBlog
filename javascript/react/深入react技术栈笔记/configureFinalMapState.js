/*eslint-disable*/
const mapState = mapStateToProps || defaultMapStateToProps

class Connect extends Component {
  configureFinalMapState(store, props) {
    const mappedState = mappedState(store.getState(), props)
    const isFactory = typeof mappedState === 'function'
    this.finalMapStateToProps = isFactory ? mappedState : mapState
    this.doStatePropsDependOnOwnProps = this.finalMapStateToProps.length !== 1
    if (isFactory) {
      return this.computeStateProps(store, props)
    }
    if (process.env.NODE_ENV !== 'production') {
      checkStateShape(mappedState, 'mapStateToProps')
    }
    return mappedState
  }
  computeStateProps(store, props) {
    if (!this.finalMapStateToProps) {
      return this.configureFinalMapState(store, props)
    }
    const state = store.getState()
    const stateProps = this.doStatePropsDependOnOwnProps
      ? this.finalMapStateToProps(state, props)
      : this.finalMapStateToProps(state)
    if (process.env.NODE_ENV !== 'production') {
      checkStateShape(stateProps, 'mapStateToProps')
    }
    return stateProps
  }
}
