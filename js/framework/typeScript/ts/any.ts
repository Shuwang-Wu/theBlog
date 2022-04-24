// 泛型 有时候为了代码的重用性
// 我们希望传入不同类型的数据, 但是我们也希望传入的数据跟返回的数据类型是同一种格式的
// 这个时候我们需要用到类型变量
// 这里不仅可以使用b来表示, 也可以使用a, c, ...来表示
function identity<b>(arg: b): b {
  return arg
}
// => function identity(arg) {return arg}
