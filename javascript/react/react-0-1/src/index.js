// import '@babel/polyfill'
import React from 'react'
import { Provider } from 'react-redux'
import { render } from 'react-dom'
import configureStore from '@/store'
import '@/styles/reset.css'
import 'antd/dist/antd.less'
import App from './app'

const store = configureStore()

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./app', renderApp)
}

renderApp()
