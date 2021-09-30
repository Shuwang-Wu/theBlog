/*
 * @Author: shuwang_wu
 * @Date: 2021-09-30 12:59:05
 * @LastEditTime: 2021-09-30 12:59:06
 * @LastEditors: shuwang_wu
 * @Description:
 * @FilePath: \notes\notes\babel\babel-plugin\src\test2.js
 */
const parser = require("@babel/parser")
const traverse = require("@babel/traverse").default
const generate = require("@babel/generator").default

const code = `function mirror(something) {
  return something
}`
const ast = parser.parse(code, {
  sourceType: "module"
})
const visitor = {
  Identifier(path) {
    path.node.name = path.node.name.split("").reverse().join("") // 反转名称
  }
}
traverse(ast, visitor)
const transformedCode = generate(ast).code
console.log(transformedCode)
