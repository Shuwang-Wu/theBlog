/* eslint-disabled */
function Watcher(vm, exp, cb) {
  // 回调函数，用来更新html中的变量
  this.cb = cb;
  // 即this, 指向新建的SelfVue实例
  this.vm = vm;
  // 发生改变的key
  this.exp = exp;
  // 自己触发订阅
  this.value = this.get();
}

Watcher.prototype = {
  // 更新订阅者
  update() {
    this.run();
  },
  run() {
    const value = this.vm.data[this.exp];
    const oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal);
    }
  },
  get() {
    // 缓存自己
    Dep.target = this;
    // 强制触发订阅器里面的get函数
    const value = this.vm.data[this.exp];
    // 释放自己
    Dep.target = null;
    return value;
  }
};
