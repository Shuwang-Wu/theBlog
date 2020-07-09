/**
 * @Description  : 路由列表
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-08 15:58:14
 * @LastEditTime : 2020-07-08 15:58:29
 * @FilePath     : \web_router\src\route-list.js
 */

export const ROUTELIST = [
  {
    path: '/',
    name: 'index',
    component: 'This is index page'
  },
  {
    path: '/hash',
    name: 'hash',
    component: 'This is hash page'
  },
  {
    path: '/history',
    name: 'history',
    component: 'This is history page'
  },
  {
    path: '*',
    name: 'notFound',
    component: '404 NOT FOUND'
  }
]
