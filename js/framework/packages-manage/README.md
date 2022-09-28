<!--
 * @Author: Shuwang_wu
 * @Date: 2022-09-28 11:07:46
 * @LastEditTime: 2022-09-28 16:02:08
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\framework\pnpm\README.md
 * @Description: 关于常用的包管理工具
-->
# npm、yarn、pnpm包管理工具

## npm 
npm 是 Node 的模块管理器

### 相关命令
1. install 安装指定依赖
2. update 更新指定依赖
3. registry 注册npm镜像源地址
4. ...and so on (详情可以在控制台中通过npm --help进行查看)

### 实现原理
输入npm install <some package>
1. 执行工程自身的preinstall
   如果工程目录有preinstall钩子则执行
2. 确定首层依赖模块
   也就是 dependencies 和 devDependencies 属性中直接指定的模块
3. 获取模块
   获取模块是一个递归的过程，分为以下几步：
   1. 获取模块信息
   2. 获取模块实体
   3. 查找该模块依赖，如果有依赖则回到第1步，如果没有则停止
4. 模块扁平化（dedupe）
   从 npm3 开始默认加入了一个 dedupe 的过程。它会遍历所有节点，逐个将模块放在根节点下面，也就是 node-modules 的第一层。当发现有重复模块时，则将其丢弃
5. 安装模块
   这一步将会更新工程中的 node_modules，并执行模块中的生命周期函数（按照 preinstall、install、postinstall 的顺序）
6. 执行工程自身生命周期
   当前 npm 工程如果定义了钩子此时会被执行（按照 install、postinstall、prepublish、prepare 的顺序）

### 缓存目录
执行 npm install | npm update 命令, 从registry下载压缩包之后, 存放到本地的缓存目录中
```bush
  # 查看本地缓存目录
  npm config get cache
```
***注意，一个模块安装以后，本地其实保存了两份。一份是~/.npm目录下的压缩包，另一份是node_modules目录下解压后的代码***
运行npm install的时候，只会检查node_modules目录，而不会检查~/.npm目录。
关于 --cache-min
也就是说，如果一个模块在～/.npm下有压缩包，但是没有安装在node_modules目录中，npm 依然会从远程仓库下载一次新的压缩包, 为了解决这些问题，npm 提供了一个--cache-min参数，用于从缓存目录安装模块。
```bush
  # --cache-min参数指定一个时间（单位为分钟），只有超过这个时间的模块，才会从 registry 下载
  $ npm install --cache-min 9999999 <package-name>
```
现在的--cache-min实现有一些问题：
1. 如果指定模块不在缓存目录，那么 npm 会连接 registry，下载最新版本。这没有问题，但是如果指定模块在缓存目录之中，npm 也会连接 registry，发出指定模块的 etag ，服务器返回状态码304，表示不需要重新下载压缩包。
2. 如果某个模块已经在缓存之中，但是版本低于要求，npm会直接报错，而不是去 registry 下载最新版本。
3. npm 团队知道存在这些问题，正在重写 cache。并且，将来会提供一个--offline参数，使得 npm 可以在离线情况下使用

### 离线安装解决方案
#### Registry代理
1. npm-proxy-cache
2. local-npm
3. npm-lazy

#### npm install代理
如果能够改变npm install的行为，就能实现缓存安装。npm-cache 工具就是这个思路。凡是使用npm install的地方，都可以使用npm-cache替代。
#### node_modules 作为缓存目录
这个方案的思路是，不使用.npm缓存，而是使用项目的node_modules目录作为缓存。
1. freight
2. npmbox
   
### 更新迭代
npm3和npm2的不同主要体现在二级模块的安装上
npm3会"尽量"把逻辑上某个层级的模块在物理结构上"全部"放在项目的第一层级里，具体我概括为以下三种情况：
1. 在安装某个二级模块时，若发现第一层级还没有相同名称的模块，便把这第二层级的模块放在第一层级
2. 在安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块
3. 在安装某个二级模块时，若发现第一层级有相同名称，但版本不同的模块，便只能嵌套在自身的父模块下方
#### npm3之前
  1. 依赖层级过深
  2. 依赖重复安装
  3. 本地缓存低效
  4. 低效的文件存储
#### npm3之后
  1. 解决的问题
   - 引入依赖扁平化（依赖安装再顶层）来处理依赖层级过深的问题
   - 依赖以递归的形式向父级查找解决重复安装的问题
   - package-lock.json解决了依赖一致性的问题
   - 提升了缓存效率
  2. 仍然存在的问题
   - 非法访问其他模块，（a引用b, b引用c, 此时a可以访问到c）
   - 低效的文件存储(当电脑上存在10个文件夹, 且每个文件夹都引用到了同一个模块的时候, 此时电脑上会存在是个同样的模块)
#### 利用npm dedupe去除冗余模块：
npm dedupe做了什么？它能够把凡是能够去除的冗余的二级依赖模块，“重定向”到名称／版本相同的一级模块

## yarn 
### 简介
Yarn 对你的代码来说是一个软件包管理器。
通过 Yarn 你可以使用其他开发者针对不同问题的解决方案，简化你开发软件的过程。 如果使用过程中遇到问题，你可以将其上报或者贡献解决方案。一旦问题被修复， 你可以使用 Yarn 更新。
代码通过 软件包（package） 的方式被共享。一个软件包里包含了所有需要共享的代码，以及一个描述软件包信息的文件 package.json （叫做 清单）。
### 安装
  1. 全局安装
    ```bush
      npm i -g yarn
    ```
  2. 按项目安装
      全局安装最新版本
      ```bush
        npm i -g yarn
      ```
      cd 到项目根目录 & 运行下面的命令
      ```bush
          # "Berry" 是 Yarn 2 发布序列的代号，同时也是 代码仓库 的名称！
          yarn set version berry
      ```
  3. 更新到最新版本
    ```bush
      yarn set version latest
    ```
  4. 安装 master 分支的最新构建版本
    ```bush
      yarn set version sources
    ```
  5. 安装 其他 分支的最新构建版本
    ```bush
      yarn set version sources --branch other-branch
    ```
### 常见命令
yarn 在项目中常用的一些命令
```bush
# 显示列表
yarn help

# 初始化一个新项目
yarn init

# 安装所有依赖项
yarn
yarn install

# 添加依赖项
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]

# 将依赖项添加到不同的依赖类别中
yarn add [package] --dev  # dev dependencies
yarn add [package] --peer # peer dependencies

# 更新依赖项
yarn up [package]
yarn up [package]@[version]
yarn up [package]@[tag]

# 删除依赖项
yarn remove [package]

# 更新 Yarn 本体
yarn set version latest
yarn set version from sources
```
### 结构
#### 总体结构
  yarn工作通过一个核心包来暴露出构建项目的所有基本组件，一些组件可能从 API 中识别的类：
  1. 配置(Configuration)
  2. 项目(Project)
  3. 工作区(Workspace)
  4. 缓存(Cache)
  5. 清单(Manifest) 
  6. and others
  核心包不会做太多的工作，仅仅包含管理项目的逻辑
#### 安装结构
##### 解析步骤
  1. 首先，我们加载存储在锁定文件中的条目，然后根据这些数据和项目的当前状态（通过读取清单文件来package.json计算），核心运行内部算法来找出丢失的条目。
  2. 对于每个缺失的条目，它使用Resolver接口查询插件，并询问他们是否知道与给定描述符 ( supportsDescriptor) 及其确切身份 ( getCandidates) 和传递依赖列表 ( resolve) 匹配的包。
  3. 一旦它获得了新的包元数据列表，核心就开始对新添加的包的传递依赖项进行新的解析传递。这将重复进行，直到发现依赖关系树中的所有包现在都将其元数据存储在锁定文件中。
  4. 最后，一旦依赖树中的每个包范围都被解析为元数据，核心会在内存中最后一次构建树，以生成我们所说的“虚拟包”。简而言之，这些虚拟包是同一基本包的拆分实例 - 我们使用它们来消除列出对等依赖项的所有包的歧义，其依赖项集将根据它们在依赖项树中的位置而改变（有关更多信息，请参阅此词典条目）
##### 获取步骤
  1. 现在我们有了构成依赖树的确切包集，我们对其进行迭代，并为每个包启动一个新的缓存请求，以了解是否可以找到该包。如果不是，我们就像我们在上一步中所做的那样，我们询问我们的插件（通过Fetcher接口）他们是否知道包（supports），如果知道，则从它的远程位置检索它（fetch）
  2. 通过抽象层与核心通信fs。我们这样做是为了让我们的包可以来自许多不同的来源——它可以来自从注册表下载的包的 zip 存档，或者来自磁盘上的实际目录以获取portal:依赖项
##### 链接步骤
  1. 为了正常工作，您使用的软件包必须以某种方式安装在磁盘上。例如，对于本机 Node 应用程序，您的包必须安装到一组node_modules目录中，以便解释器可以找到它们。这就是链接器的意义所在。通过Linker和Installer接口，Yarn 核心将与注册的插件通信，让它们知道依赖关系树中列出的包，并描述它们的关系（例如，它会告诉它们tapable是 的依赖关系webpack）。然后，插件可以以他们认为合适的任何方式决定如何处理这些信息

### 关于缓存
yarn 会将安装过的包缓存下来，这样再次安装相同包的时候，就不需要再去下载， 而是直接从缓存文件中直接copy进来

### 离线镜像
如果你以前安装过某个包，再次安装时可以在没有任何互联网连接的情况下进行。yarn的离线镜像是为了在无网络情况下使用的，是在本地维护了一个镜像，默认是不开启的

### Lock
我们需要保证在不同的机器上安装包能获得相同的结果，所以就有了锁的概念。
yarn 在安装期间，只会使用当前项目的yarn.lock文件（即顶级yarn.lock文件），会忽略任何依赖里面的 yarn.lock 文件。
yarn 安装依赖的过程：
  Checking => resolving Packages => fetching Packages => linking Packages => building Packages
  1. Checking
  在正式安装前，yarn会做一些check工作，会检查是否有npm的一些配置文件（Shrinkwrap，npm lockfile），如果有，会提示用户避免存在这些文件，可能会导致冲突。之后会去检查一些Manifest，包括os，cpu，engines，模块兼容等配置项。
  2. resolving Packages
  获取依赖包，这一步，会对缓存中没有的包进行下载，将对应package下载到缓存目录下，完成这一步，代表着依赖树中需要的所有包都存在缓存当中了
  [解析过程](./assets/yarn-resolving-packages.webp)
  3. fetching Packages
  解析包的信息，在这一步，会解析出依赖树中每个包的具体版本信息
  [获取过程](./assets/yarn-resolving-packages.webp)
  4. linking Packages
  这一步，是将缓存中的对应包扁平化的安装到项目的依赖目录下（一般为node_modules）
  [链接过程](./assets/yarn-resolving-packages.webp)
  1. building Packages
  对于一些二进制包，需要进行编译，在此时进行


## pnpm

### 涉及知识点拓展
1. 文件的本质
  在操作系统中，文件实际上是一个指针，只不过它指向的不是内存地址，而是一个外部存储地址（这里的外部存储可以是硬盘、U盘、甚至是网络）
  当我们删除文件时，删除的实际上是指针，因此，无论删除多么大的文件，速度都非常快。像我们的U盘、硬盘里的文件虽然说看起来已经删除了，但是其实数据恢复公司是可以恢复的，因为数据还是存在的，只要删除文件后再没有存储其它文件就可以恢复，所以真正删除一个文件就是反复存储删除
2. 文件的拷贝
  如果你复制一个文件，是将该文件指针指向的内容进行复制，然后产生一个新文件指向新的内容 
3. 硬链接
  硬链接的概念来自于 Unix 操作系统，它是指将一个文件A指针复制到另一个文件B指针中，文件B就是文件A的硬链接
4. 符号链接
  符号链接又称为软连接，如果为某个文件或文件夹A创建符号连接B，则B指向A
  与硬链接的区别：
  1. 硬链接仅能链接文件，而符号链接可以链接目录
  2. 硬链接在链接完成后仅和文件内容关联，和之前链接的文件没有任何关系。而符号链接始终和之前链接的文件关联，和文件内容不直接相关。
5. 符号链接与硬链接的区别
6. 快捷方式
  快捷方式类似于符号链接，是windows系统早期就支持的链接方式。它不仅仅是一个指向其他文件或目录的指针，其中还包含了各种信息：如权限、兼容性启动方式等其他各种属性，由于快捷方式是windows系统独有的，在跨平台的应用中一般不会使用
7. node环境对硬链接和符号链接的处理
  1. 硬链接：
    硬链接是一个实实在在的文件，node不对其做任何特殊处理，也无法区别对待，实际上，node根本无从知晓该文件是不是一个硬链接
  2. 符号链接：
    由于符号链接指向的是另一个文件或目录，当node执行符号链接下的JS文件时，会使用原始路径。比方说：我在D盘装了LOL，在桌面创建了LOL快捷方式，相当于是符号链接，双击快捷方式运行游戏，在运行游戏的时候是按照LOL原始路径（D盘路径）运行的。

### 原理
pnpm使用符号链接和硬链接来构建node_modules目录

### 步骤
1. 通过package.json查询依赖关系，得到最终要安装的包：a和b
2. 在工程proj根目录中查看a和b是否已经有缓存，如果没有，下载到缓存中，如果有，则进入下一步
3. 在proj中创建 node_modules 目录，并对目录进行结构初始化
4. 从缓存的对应包中使用硬链接放置文件到相应包代码目录中
5. 使用符号链接，将每个包的直接依赖放置到自己的目录中
6. 新版本的pnpm为了解决一些书写不规范的包（读取间接依赖）的问题，又将所有的工程非直接依赖，使用符号链接加入到了 .pnpm/node_modules 中。如果b依赖c，a又要直接用c，这种不规范的用法现在pnpm通过这种方式支持了。但对于那些使用绝对路径的奇葩写法，可能没有办法支持
7. 在工程的node_modules目录中使用符号链接，放置直接依赖

### pnpm特性
1. pnpm依赖管理
  npm使用扁平化的node_modules，存在安全问题，可以未经package.json声明而直接只用依赖；
  pnpm使用了软链接的方式，真正的包安装在了.pnpm目录下，只会对项目中package.json中声明的依赖包，放置在node_modules目录下
  解决了扁平化包带来的未声明依赖的安全问题
2. Pnpm monorepo
  npm使用扁平化的node_modules，存在安全问题，可以未经package.json声明而直接只用依赖；
  pnpm使用了软链接的方式，真正的包安装在了.pnpm目录下，只会对项目中package.json中声明的依赖包，放置在node_modules目录下
  解决了扁平化包带来的未声明依赖的安全问题
