/*
 * @Author: shuwang_wu
 * @Date: 2021-05-18 19:46:38
 * @LastEditTime: 2021-05-22 16:30:00
 * @LastEditors: shuwang_wu
 * @Description: 自定义脚手架 hello-cli
 * @FilePath: \notes\notes\hello-cli\hello-cli.js
 */

# Hello-cli

## 脚手架怎么工作的 ?

1. 初始化，一般在这个时候会进行环境的初始化，做一些前置的检查
2. 用户输入，例如用 vue-cli 的时候，它会“问”你很多配置选项
3. 生成配置文件
4. 生成项目结构，这是候可能会使用一个项目模版
5. 安装依赖
6. 清理、校验等收尾工作

对于想要快速创建一个脚手架，其实我们不用完全从零开始。Yeoman 就是一个可以帮我们快速创建脚手架的工具

## Yeoman

- 官网(https://yeoman.io/learning/index.html)
- 中文网(https://yowebapp.github.io/learning/)

1. 安装 yo 和 generate-webapp
```bush
npm install -g yo
npm install -g generator-webapp
```