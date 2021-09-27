export default {
  pages: [
    "pages/home/index",
    "pages/bid-center/index",
    "pages/my-bid/index",
    "pages/user-center/index",
  ],
  tabBar: {
    // custom: true,
    borderStyle: "white",
    color: "#666666",
    selectedColor: "#FF2F47",
    backgroundColor: "#ffffff",
    list: [
      {
        iconPath: "assets/images/home.png",
        selectedIconPath: "assets/images/home-selected.png",
        pagePath: "pages/home/index",
        text: "首页",
      },
      {
        iconPath: "assets/images/bid-center.png",
        selectedIconPath: "assets/images/bid-center-selected.png",
        pagePath: "pages/bid-center/index",
        text: "竞拍中心",
      },
      {
        iconPath: "assets/images/my-bid.png",
        selectedIconPath: "assets/images/my-bid-selected.png",
        pagePath: "pages/my-bid/index",
        text: "我的竞拍",
      },
      {
        iconPath: "assets/images/private-center.png",
        selectedIconPath: "assets/images/private-center-selected.png",
        pagePath: "pages/user-center/index",
        text: "个人中心",
      },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
    initialRenderingCache: "static",
  },
};
