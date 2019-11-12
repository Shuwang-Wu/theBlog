/*eslint-disable*/
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM, { findDOMNode } from 'react-dom'

class Graphic extends Component {
  static propTypes = {
    rotation: PropTypes.number,
    color: PropTypes
  }
  static defaultProps = {
    rotation: 0,
    color: 'green'
  }
  componentDidMount() {
    const context = findDOMNode(this).getContext('2d')
    this.paint(context)
  }
  componentDidUpdate() {
    const context = findDOMNode(this).getContext('2d')
    context.clearRect(0, 0, 200, 200)
    this.paint(context)
  }
  paint(context) {
    context.save()
    context.translate(100, 100)
    context.rotate(this.props.rotation, 100, 100)
    context.fillStyle = this.props.color
    context.fillRect(-50, -50, 100, 100)
    context.restore()
  }
  render() {
    return <canvas width={200} height={200} />
  }
}
