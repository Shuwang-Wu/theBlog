/*
 * @Author: Shuwang_wu
 * @Date: 2024-01-08 15:16:18
 * @LastEditTime: 2024-01-08 15:18:04
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\framework\vue-cli\bin\tiny.js
 * @Description: please edit
 */
const program = require("commander")
const create = require("../core/create")

program
  .version("0.0.1")
  .command("create <name>")
  .description("create a new project")
