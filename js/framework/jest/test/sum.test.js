/*
 * @Author: Shuwang_wu
 * @Date: 2022-04-27 16:45:10
 * @LastEditTime: 2022-04-27 16:52:14
 * @LastEditors: Shuwang_wu
 * @FilePath: \theBlog\js\framework\jest\test\sum.test.js
 * @Description: ~
 */
const sum = require("../src/sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
