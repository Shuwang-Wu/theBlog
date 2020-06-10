# css相关

## 文件
    base.css 其中包含原子类、常用的属性等
    layout.css
    commom.css
    ...page.css

1. base.css
    - 原子类
    ```css
    .w100 { width: 100px; }
    .h100 { height: 100px; }
    .mr10 { margin-right: 10px; }
    ```
    
2. layout.css
    针对不同屏幕的一些css代码
    ```css
    @media screen 1000px { ...your style code }
    ```
3. commom.css
    公共的代码，有一些需要统一配置的css代码
    ```css
    @media screen 1000px { ...your style code }
    ```
4. page.css
    各个页面的代码
    ```css
    @media screen 1000px { ...your style code }
    ```