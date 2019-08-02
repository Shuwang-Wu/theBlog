// react 代码
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>
  }
}
// babel编译后的代码

var HelloMessage = (function(_Component) {
  _inherits(HelloMessage, _Component)
  function HelloMessage() {
    _classCallCheck(this, HelloMessage)
    return _possibleConstructorReturn(
      this,
      Object.getPrototypeOf(HelloMessage).apply(this, arguments)
    )
  }
  _createClass(HelloMessage, [
    {
      key: 'render',
      value: function render() {
        return _react2.default.createElement(
          'div',
          null,
          'Hello ',
          this.props.name
        )
      }
    }
  ])
  return HelloMessage
})(_react.Component)

_reactDom2.default.render(
  _react2.default.createElement(page, null),
  document.getElementById('app')
)
