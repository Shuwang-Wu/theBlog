/**
 * @Description  : 工具函数
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-07-28 17:09:44
 * @LastEditTime : 2020-07-28 17:13:23
 * @FilePath     : \bid\src\utils\tools.js
 */

export const getType = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

export const isFunction = function (obj) {
  return getType(obj) === "Function";
};
