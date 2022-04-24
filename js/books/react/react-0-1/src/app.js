import React from 'react'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Home from '@/views/home'
import Other from '@/views/other'
import '@/styles/app.less'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="app">
          <ul className="sidebar">
            <li>
              <Link to="/">首页</Link>
            </li>
            <li>
              <Link to="/other">其他页</Link>
            </li>
          </ul>
          <div className="content">
            <Route path="/" exact component={Home}></Route>
            <Route path="/other" component={Other}></Route>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
