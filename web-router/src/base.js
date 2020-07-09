/**
 * @Description  : base.js
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-08 16:23:34
 * @LastEditTime : 2020-07-08 16:45:43
 * @FilePath     : \web_router\src\base.js
 */

const ELEMENT = document.querySelector('#page')

export class BaseRouter {
  constructor(list) {
    this.list = list
  }
  render(state) {
    //匹配当前的路由,匹配不到则使用404配置内容 并渲染~
    let ele = this.list.find(ele => ele.path === state)
    ele = ele ? ele : this.list.find(ele => ele.path === '*')
    ELEMENT.innerText = ele.component
  }
}
