/**
 * @Description  : 由于图片资源没有存储在本地而是放置到远程服务器上, 因此需要配置资源地址
 * @Author       : YH000052
 * @LastEditors  : YH000052
 * @Date         : 2020-04-28 17:14:37
 * @LastEditTime : 2020-07-28 14:55:12
 * @FilePath     : \bid\src\utils\images.js
 */

// cdn地址
export const assetsUrl =
  "https://preyihuadl-oppo-com-test.oss-cn-beijing.aliyuncs.com/auction_h5/";

// 图片key值
export const imgKeys = {
  banner1: "banner-1",
  banner2: "banner-2",
  banner3: "banner-3",
  address: "address",
  defaultAvatar: "default-avatar",
  defaultGraph: "default-graph",
  IDCard1: "idcard-1",
  IDCard2: "idcard-2",
  settleInEnterprise: "settle-in-enterprise",
  settleInPrivate: "settle-in-private",
  shadingBottom: "shading-bottom",
  shadingTop: "shading-top",
  license: "license",
  share: "share",
  deposit: "deposit",
  privateAvater: "private-avater",
  defaultGraphHome: "default-graph-home",
};

// 图标key值
export const iconKeys = {
  iconAlert: "alert",
  arrowLeft: "arrow-left",
  arrowLeftGray: "arrow-left-gray",
  arrowLeftR: "arrow-left-r",
  arrowR: "arrow-r",
  arrowRightBlue: "arrow-right-blue",
  arrowRightGray: "arrow-right-gray",
  arrowRightR: "arrow-right-r",
  close: "close",
  crown: "crown",
  loading: "loading",
  menuBack: "menu-back",
  next: "next",
  topTo: "top-to",
  bid: "bid",
  pay: "pay",
  box: "box",
  search: "search",
  stamp: "stamp",
  wechat: "wechat",
  more: "more",
  location: "location",
  firstHand_1: "first-hand",
  firstHand_2: "first-hand@2x",
  firstHand_3: "first-hand@3x",
  free_1: "free",
  free_2: "free@2x",
  free_3: "free@3x",
  justify_1: "justify",
  justify_2: "justify@2x",
  justify_3: "justify@3x",
  quality_1: "first-hand",
  quality_2: "first-hand@2x",
  quality_3: "first-hand@3x",
};

/**
 * @name 获取屏幕分辨率
 * @desc 默认当前屏幕分辨率为1, 因为当前ui给的图片有些不完全, 所以暂时先不做图片的适配
 * */
export const getDpr = function () {
  const dpr = 1;
  wx.getSystemInfoSync({
    success(res) {
      dpr = res.devicePixelRatio;
    },
  });
};

/**
 * @name 生成图片
 * @param {Object} keys 图片、图标key值
 * @param {String} prefix 前缀
 * @returns {Array} imgs 图片数组
 */
const generateImg = function (keys, prefix) {
  // 图片适配
  // let dpr = getDpr()
  let imgs = {};
  for (const key in keys) {
    if (keys.hasOwnProperty(key)) {
      const img = keys[key];
      imgs[key] = assetsUrl + prefix + img + ".png";
    }
  }
  return imgs;
};

// 生成图片地址路径
export const images = generateImg(imgKeys, "images/");
// 生成图标地址路径
export const icons = generateImg(iconKeys, "icon/");
