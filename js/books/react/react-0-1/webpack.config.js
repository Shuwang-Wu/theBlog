const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'
const MODE = isDev ? 'production' : 'development'
const srcPath = path.resolve(__dirname, 'src')
const resolve = path.resolve

module.exports = {
  mode: MODE,
  devtool: isDev,
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.js', '.jsx', 'json'],
    // 设置别名
    alias: {
      '@': resolve('src'), // 这样配置后 @ 可以指向 src 目录
      _c: path.resolve('src/component'),
      _v: path.resolve('src/views'),
      _s: path.resolve('src/store')
    }
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/react'],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['import', { libraryName: 'antd', style: true }]
              ]
            }
          }
        ],
        exclude: /node_modules/,
        include: srcPath
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
        // include: path.resolve(__dirname, 'src')
        include: srcPath
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('public/index.html'),
      inject: true
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dist/manifest.json')
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dist/react.dll.js')
    })
  ],
  devServer: {
    // 指定要使用的 host。如果你希望服务器可从外部访问
    host: 'localhost',
    contentBase: path.join(__dirname, 'dist'),
    // 如果想使用 contentBasePublicPath 在多个 URL 上提供静态内容，也可以从多个目录提供服务
    // contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')]
    compress: true,
    port: 9000,
    // 是否启用webpack的HotModuleReplacementPlugin
    hot: true,
    // 告诉 dev-server 在服务器启动后打开浏览器
    // open: true,
    // 启用热模块替换，而无需页面刷新作为构建失败时的回退
    // hotOnly: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
      // 有时不想代理所有内容。 可以基于函数的返回值绕过代理。

      // 在该功能中，可以访问请求，响应和代理选项。

      // 返回 null 或 undefined 以继续使用代理处理请求。
      // 返回 false 会为请求产生404错误。
      // 返回提供服务的路径，而不是继续代理请求。
      // 例如。 对于浏览器请求，想要提供 HTML 页面，但是对于 API 请求，想要代理它。 可以执行以下操作：
      // '/api': {
      //   target: 'http://localhost:3000',
      //   bypass: function(req, res, proxyOptions) {
      //     if (req.headers.accept.indexOf('html') !== -1) {
      //       console.log('Skipping proxy for browser request.');
      //       return '/index.html';
      //     }
      //   }
      // }
    },
    // 默认情况下，开发服务器将通过HTTP提供服务。可以选择使用HTTPS通过HTTP/2提供服务
    // https: true,
    // 根据上述配置，将使用自签名证书，但是你也可以提供自己的证书
    // key: fs.readFileSync('/path/to/server.key'),
    // cert: fs.readFileSync('/path/to/server.crt'),
    // ca: fs.readFileSync('/path/to/ca.pem'),
    // 允许访问的域名
    // allowedHosts: [
    //   'host.com',
    //   'subdomain.host.com',
    //   'subdomain2.host.com',
    //   'host2.com'
    // ],
    // 提供了一个在 devServer 内部的 所有中间件执行之前的自定义执行函数
    // before: function (app, server, compiler) {
    // app.get('/some/path', function (req, res) {
    //   res.json({ custom: 'response' })
    // console.log(app, server, compiler, 'before')
    // })
    // },
    // 提供了一个在 devServer 内部的 所有中间件执行之后的自定义执行函数
    // after: function (app, server, compiler) {
    // do fancy stuff
    // console.log(app, server, compiler, 'after')
    // },
    // 这个配置用于在启动时通过 ZeroConf 网络广播你的开发服务器，用于服务发现
    // bonjour: true,
    // 为每个静态文件开启 gzip compression
    compress: true
    // 当将此项配置设置为 true 时，将会跳过 host 检查. 这是不推荐的 因为不检查host的应用容易受到DNS重新绑定攻击。
    // disableHostCheck: true,
    // 为所有请求添加响应标头
    // headers: {
    //   'X-Custom-Foo': 'bar'
    // },
    // 当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容。 将 devServer.historyApiFallback 设为 true开启
    // 通过传递对象，可以使用配置选项诸如 rewrites
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /^\/$/, to: '/views/landing.html' },
    //     { from: /^\/subpage/, to: '/views/subpage.html' },
    //     { from: /./, to: '/views/404.html' }
    //   ]
    // }
  }
}

// module.exports = function override(config, env) {

//   config = rewireLess.withLoaderOptions({
//       javascriptEnabled: true,
//       // modifyVars: { "@primary-color": "#1DA57A" },
//   })(config, env);

//   return config;

// };
