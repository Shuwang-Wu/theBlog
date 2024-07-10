/*
 * @Author: Shuwang_wu
 * @Date: 2024-01-03 10:06:36
 * @LastEditTime: 2024-01-03 10:07:55
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\babel7\demo\babel.config.js
 * @Description: please edit
 */
module.exports = function (api) {
  api.cache(true)
  const presets = ["@babel/preset-env"]
  const plugins = []
  return { presets, plugins }
}
