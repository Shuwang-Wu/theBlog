/*eslint-disable*/
/**
 * @file Observe
 * @description 劫持并监听data属性, 通过Object.defineProperty()来对data属性进行改写,
 *   在其中还要添加订阅器来对数据的改变进行订阅操作
 */

/**
 * @constructor Dep
 * @desc 创建订阅器, 其中subs用来保存订阅者, 并在原型中定义了addSub, notify两个方法
 *   addSub在监听数据的时候添加到subs里面, 当数据发生改变的时候通过notify通知更新
 *
 */
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  addSub(sub) {
    this.subs.push(sub);
  },
  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
};

Dep.target = null;

function Observe(data) {
  this.data = data;
  this.walk(data);
}

Observe.prototype = {
  walk(data) {
    const self = this;
    Object.keys(data).map(key => {
      self.defineReactive(data, key, data[key]);
      return false;
    });
  },
  defineReactive(data, key, val) {
    const dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function getter() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function setter(newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        dep.notify();
      }
    });
  }
};
