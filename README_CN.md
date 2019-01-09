中文 | [English](README.md)

# ios-photo-repair

[![npm](https://img.shields.io/npm/v/ios-photo-repair.svg)](https://www.npmjs.com/package/@tower1229/ios-photo-repair) [![compatibility](https://img.shields.io/badge/compatibility-IE10%2B-orange.svg)]() [![license](https://img.shields.io/github/license/tower1229/ios-photo-repair.svg)]()

一个IOS拍照方向修复工具

## 特性

简单直接，两个方法解决WEB环境中的两种修复需求

## 快速开始

1. 使用npm安装:

```shell
npm i ios-photo-repair --save
```

2. 导入到项目

```shell
let { fixBySelector, fixImgFile } = require("ios-photo-repair")
```

3. 修复来自上传控件的图片文件

```shell
// fixImgFile(file, compressOption)

fixImgFile(file, {
    width:500,      // 默认不限制
    height:500,     // 默认不限制
    ratio: 0.92     // 默认不压缩
}).then(base64 => {
    document.getElementById('iosphoto').src = base64
})
```

或者修复一个网页中的图片元素

```shell
//fixBySelector(querySelector)

fixBySelector('#iosphoto')
```

## License

MIT