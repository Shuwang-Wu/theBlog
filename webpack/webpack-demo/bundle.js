const fs = require('fs')
const path = require('path')
// 将文件解析成抽象语法树
const parser = require('@babel/parser')
// 遍历抽象语法树, 将用到的依赖收集起来
const traverse = require('@babel/traverse').default
// 将es6代码转成es5
const babel = require('@babel/core')
const getModuleInfo = (file) => {
  const body = fs.readFileSync(file, 'utf-8')
  const ast = parser.parse(body, {
    // 表示我们要解析的是es模块
    sourceType: 'module'
  })
  const deps = {}
  traverse(ast, {
    ImportDeclaration({
      node
    }) {
      const dirname = path.dirname(file)
      const absPath = './' + path.join(dirname, node.source.value)
      deps[node.source.value] = absPath
    }
  })
  // 将传入的AST转化成在第三个参数里配置的模块类型
  const {
    code
  } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })
  const module = {
    file,
    deps,
    code
  }
  return module
}

// 新增代码
const parseModules = (file) => {
  const entry = getModuleInfo(file)
  const temp = [entry]
  const depsGraph = {}
  for (let i = 0; i < temp.length; i++) {
    let deps = temp[i].deps
    if (deps) {
      for (const key in deps) {
        if (deps.hasOwnProperty(key)) {
          temp.push(getModuleInfo(deps[key]))
        }
      }
    }
  }
  // 新增代码
  temp.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })
  return depsGraph
}

// getModuleInfo('./src/index.js')
parseModules('./src/index.js')

const bundle = (file) =>{
  const depsGraph = JSON.stringify(parseModules(file))
  return `(function (graph) {
      function require(file) {
          function absRequire(relPath) {
              return require(graph[file].deps[relPath])
          }
          var exports = {}
          (function (require,exports,code) {
              eval(code)
          })(absRequire,exports,graph[file].code)
          return exports
      }
      require('${file}')
  })(${depsGraph})`

}
const content = bundle('./src/index.js')

console.log(content);

fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js',content)