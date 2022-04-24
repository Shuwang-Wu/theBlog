# 前端通过后端返回的 blob 实现下载功能

## 知识点

1. blob 对象
   HTML5 中的 file 等是基于 blob 对象来实现的


## 解决代码

1. 请求接口处理
```js
$.ajax({
    url: 'xxx'
    type: 'get',
    param: {}
    responseType: 'blob' // 设置为文件流否则会出现乱码
})
```

2. 前端代码处理
```js
function downloadFile(data, fileName) {
    let blob = new Blob([blob], {type: 'application/vnd.ms-excel'})
    let tagA = document.createElement('a')
    let href = URL.createObjectURL(blob)
    tagA.style.display = 'none'

}
```