# 前端下载

## a 标签下载

```js
var a = document.createElement("A");
a.href = "xxx.zip";
a.setAttribute("download", "fileName");
a.click();
```

### 局限性:

浏览器支持:

1. IE, Safari, Opera 不支持
2. FireFox, Chrome 支持, 但是只能下载不能在浏览器中打开的文件格式, 能在浏览器中的打开的会有弹框出现且在点击保存之后才能进行下载

- 那么能不能不让浏览器预览图片(或 pdf 或 txt 文件)？

1. DataUrl

```js
// ./util.js
// 图片转base64
function image2base64(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const mime = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  const dataUrl = canvas.toDataURL("image/" + mime);
  return dataUrl;
}
// html页面，将a标签href属性动态赋值为dataUrl
<a id="downloadDataUrl" class="button is-dark">
  下载data:Url图片
</a>;
const image = new Image();
image.setAttribute("crossOrigin", "Anonymous");
image.src = "../files/test-download.png" + "?" + new Date().getTime();
image.onload = function() {
  const imageDataUrl = image2base64(image);
  const downloadDataUrlDom = document.getElementById("downloadDataUrl");
  downloadDataUrlDom.setAttribute("href", imageDataUrl);
  downloadDataUrlDom.setAttribute("download", "download-data-url.png");
  downloadDataUrlDom.addEventListener("click", () => {
    console.log("下载文件");
  });
};
```

2. BlobUrl

```js
// 将需要的文件转成base64
// 第二步：将base64转换成blob数据
// DataUrl 转 Blob数据
function dataUrl2Blob(dataUrl) {
    var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bStr = atob(arr[1]),
        n = bStr.length,
        unit8Array = new Unit8Array(n);
    while (n--) {
        unit8Array[n] = bStr.charCodeAt(n);
    }
    return new Blob([unit8Array]m {type: mime})
}
// 第三步： 将blob数据转换成BlobUrl
URL.createObjectURL(imageBlobData);
// 完整代码
//   <a id='downloadBlobUrl' class="button is-danger">下载blobUrl图片</a>
const image2 = new Image();
image2.setAttribute("crossOrigin",'Anonymous');
image2.src = '../files/test-download.png' + '?' + new Date().getTime();
image2.onload = function() {
    const imageDataUrl = image2base64(image2);
    const imageBlobData = dataUrl2Blob(imageDataUrl);
    const downloadDataUrlDom = document.getElementById('downloadBlobUrl');
    downloadDataUrlDom.setAttribute('href', URL.createObjectURL(imageBlobData));
    downloadDataUrlDom.setAttribute('download', 'download-data-url.png');
    downloadDataUrlDom.addEventListener('click', () => {
        console.log('下载文件');
    });
}

```
