# 控制多行文本溢出隐藏
```scss
  overflow: hidden;
  display: -webkit-box;
  // 设置文本在任意处换行
  word-break: break-all;
  // 文本溢出隐藏
  text-overflow: ellipsis;
  // 文本垂直方向排列
  -webkit-box-orient: vertical;
  // 超出两行之后溢出隐藏
  -webkit-line-clamp: 2;
```