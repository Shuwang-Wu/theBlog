/*
 * @Author: shuwang_wu
 * @Date: 2021-09-30 12:42:38
 * @LastEditTime: 2021-09-30 13:01:33
 * @LastEditors: shuwang_wu
 * @Description: 
 * @FilePath: \notes\notes\babel\babel-plugin\webpack.config.js
 */
/*
 * @Author: shuwang_wu
 * @Date: 2021-09-30 12:26:46
 * @LastEditTime: 2021-09-30 12:30:47
 * @LastEditors: shuwang_wu
 * @Description:
 * @FilePath: \notes\notes\babel\babel-plugin\webpack.config.js
 */
module.exports = {
  entry: {
    index: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: paths.src,
        loader: require.resolve("babel-loader"),
        options: {
          presets: ["react-app"],
          plugins: [["your babel plugin", {}]],
          compact: true 
        }
      }
    ]
  },
  plugins: []
}
