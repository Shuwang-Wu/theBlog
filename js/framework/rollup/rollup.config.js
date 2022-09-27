/*
 * @Author: Shuwang_wu
 * @Date: 2022-05-20 09:50:03
 * @LastEditTime: 2022-05-20 09:57:18
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\framework\rollup\rollup.config.js
 * @Description: ~
 */
export default {
  // 核心选项
  input,
  external,
  plugins,

  //  额外选项
  onwarn,

  // danger zone
  acorn,
  context,
  moduleContext,
  legacy,

  // output 必须 如果要输出多个可以是一个数组
  output: {
    // 核心选项
    file, // 必须
    format, // 必须
    name,
    globals,

    // 额外选项
    paths,
    banner,
    footer,
    intro,
    outro,
    sourcemap,
    sourcemapFile,
    interop,

    // 高危选项
    exports,
    amd,
    indent,
    strict
  }
}
