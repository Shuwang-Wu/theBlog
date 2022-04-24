/* eslint-disabled */
function SelfVue(options) {
  const self = this;
  // 把data, methods等属性取出来
  this.data = options.data;
  this.methods = options.methods;

  // 进行数据代理
  Object.keys(this.data).forEach(key => {
    self.proxyKeys(key);
  });

  // 监听数据 => Observe.js
  observe(this.data);

  // 编译传入的模版文件, 在完成了数据监听的时候会进行调用
  new Compile(options.el, this);

  // 加载到Dom
  options.mounted.call(this);
}

SelfVue.prototype = {
  /**
   * @method proxyKeys
   * @desc 通过Object.defineProperty对传入的参数进行数据代理, 即options
   */
  proxyKeys(key) {
    const self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function getter() {
        return this.data[key];
      },
      set: function setter(newVal) {
        self.data[key] = newVal;
      }
    });
  }
};

function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }
  return new Observe(data);
}
