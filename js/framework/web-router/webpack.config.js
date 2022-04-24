/**
 * @Description  : webpack.config.js
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-08 15:51:12
 * @LastEditTime : 2020-07-08 15:56:06
 * @FilePath     : \web_router\webpack.config.js
 */

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[hash:8].js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ],
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    inline: true,
    open: true,
    //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html (解决histroy mode 404)
    historyApiFallback: true,
    host: 'localhost',
    port: '8080',
    compress: true
  }
}
