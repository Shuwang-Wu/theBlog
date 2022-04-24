/*
 * @author       : shuwang.wu@getech.cn
 * @createdDate  : 2020-08-27 15:34:45
 * @version      : 1.0
 * @modifier     : shuwang.wu@getech.cn
 * @modifiedDate : 2020-08-27 16:24:53
 * @reason       :
 * @FilePath     : \webpack-1\src\router\index.js
 */

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const routes = [
  {
    key: 'home',
    name: 'home',
    title: '首页',
    component: () => import('_v/home')
  },
  {
    key: 'other',
    name: 'other',
    title: '其他页',
    component: () => import('_v/other')
  }
]
