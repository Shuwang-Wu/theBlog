/**
 * @Description  : index.js 入口文件
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-08 15:53:33
 * @LastEditTime : 2020-07-08 17:05:32
 * @FilePath     : \web_router\src\index.js
 */

import { ROUTELIST } from './route-list'

const { HashRouter } = require('./hash')
const { HistoryRouter } = require('./history')
const MODE = 'hash'

class WebRouter {
  constructor({ mode = 'hash', routeList }) {
    this.router = mode === 'hash' ? new HashRouter(routeList) : new HistoryRouter(routeList)
  }
  push(path) {
    this.router.push(path)
  }
  replace(path) {
    this.router.replace(path)
  }
  go(num) {
    this.router.go(num)
  }
}

const webRouter = new WebRouter({
  mode: MODE,
  routeList: ROUTELIST
})

document.querySelector('.btn-list').addEventListener('click', e => {
  const event = e || window.event
  if (event.target.tagName === 'LI') {
    const url = event.target.dataset.url
    !url.indexOf('/') ? webRouter.push(url) : webRouter.go(url)
  }
})

document.querySelector('.replace-btn').addEventListener('click', e => {
  webRouter.replace('/')
})
