const ELEMENT = document.querySelector("#page");

export class BaseRouter {
  constructor(list) {
    this.list = list;
  }
  render(state) {
    //匹配当前的路由,匹配不到则使用404配置内容 并渲染~
    let ele = this.list.find((ele) => ele.path === state);
    ele = ele ? ele : this.list.find((ele) => ele.path === "*");
    ELEMENT.innerText = ele.component;
  }
}
