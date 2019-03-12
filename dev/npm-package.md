# 如何创建自己的 npm 代码仓库

- 注册 npm 帐号
- 在命令行工具中输入 npm login 登录到 npm
- 在此之前如果你使用的是淘宝镜像，要去掉！
- 新建一个文件夹, cd 到这个文件夹，输入 npm -y init 初始化 npm 配置
- 简单一点，创建一个 index.js
  - > 内容： module.export = function() {console.log('my first module')}
- 运行 npm publish
- done!
