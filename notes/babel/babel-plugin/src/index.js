/*
 * @Author: shuwang_wu
 * @Date: 2021-09-30 09:49:33
 * @LastEditTime: 2021-09-30 14:19:48
 * @LastEditors: shuwang_wu
 * @Description:
 * @FilePath: \notes\notes\babel\babel-plugin\src\index.js
 */
const t = require("@babel/types")
const awaitMap = []
const letToVar = function (babel) {
  const { types, template } = babel
  return {
    visitor: {
      Identifier(path) {
        path.node.name = path.node.name.split("").reverse().join("") // 反转名称
      },
      VariableDeclaration(path, state) {
        if (path.get("kind").node === "let") {
          path.node.kind = "var"
        }
      },
      FunctionDeclaration(path) {
        // 在这里声明了一个模板，比用@babel/types去生成方便很多
        const temp = template(`
          if(something) {
            NORMAL_RETURN
          } else {
            return 'nothing'
          }
        `)
        const returnNode = path.node.body.body[0]
        const tempAst = temp({
          NORMAL_RETURN: returnNode
        })
        path.node.body.body[0] = tempAst
      },
      AwaitExpression(path, state) {
        const tryCatchPath = path.findParent(p => {
          return t.isTryStatement(p)
        })
        if (tryCatchPath) return path.skip()
        const leftId = path.parent.id
        if (leftId) {
          const type = leftId.type
          path.node.argument.returnType = type
        }
        awaitMap.push(path.node.argument)
      },
      ReturnStatement(path) {
        path.replaceWithMultiple([
          t.expressionStatement(t.stringLiteral("Is this the real life?")),
          t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
          t.expressionStatement(
            t.stringLiteral("(Enjoy singing the rest of the song in your head)")
          )
        ])
      }
    }
  }
}
module.exports = letToVar
