function* quips(name) {
  yield "你好 " + name + "!";
  yield "希望你能喜欢这篇介绍 ES6 的译文";
  if (name.startsWith("X")) {
    yield "你的名字 " + name + " 首字母是 X，这很酷！";
  }
  yield "我们下次再见！";
}

var g1 = quips("X-man");

for (const iterator of g1) {
  //   iterator.next();
  console.log(iterator);
}

// 实现一个简单的迭代器
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }
  [Symbol.iterator]() {
    return this;
  }
  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return { done: false, value: value };
    } else {
      return { done: true, value: undefined };
    }
  }
}
function range(start, stop) {
  return new RangeIterator(start, stop);
}
