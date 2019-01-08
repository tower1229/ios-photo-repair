中文 | [English](README.md)

# ios-photo-repair

一个IOS拍照方向修复工具

## 特性

简单直接，两个方法解决WEB环境中的两种修复需求

## 快速开始

1. 使用npm安装:

`npm i ios-photo-repair --save`

2. 导入到项目

`let { fixBySelector, fixImgFile } = require("ios-photo-repair")`

3. 修复来自上传控件的图片文件

```
// fixImgFile(file, compressOption)

fixImgFile(file, {
    width:500,
    height:500
}).then(base64 => {
    document.getElementById('iosphoto').src = base64
})
```

或者修复一个网页中的图片元素

```
//fixBySelector(querySelector)

fixBySelector('#iosphoto')
```

## License

MIT