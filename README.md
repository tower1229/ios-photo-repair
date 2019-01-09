English | [中文](README_CN.md)

# ios-photo-repair

[![npm](https://img.shields.io/npm/v/ios-photo-repair.svg)](https://www.npmjs.com/package/@tower1229/ios-photo-repair) [![compatibility](https://img.shields.io/badge/compatibility-IE10%2B-orange.svg)]() [![license](https://img.shields.io/github/license/tower1229/ios-photo-repair.svg)]()

An IOS Photo Direction Repair Tool

## Features

Simple and direct, two methods to solve two kinds of repair requirements in WEB environment

## Getting started

1. install with npm:

```shell
npm i ios-photo-repair --save
```

2. import to your project

```shell
let { fixBySelector, fixImgFile } = require("ios-photo-repair")
```

3. Fix the image file obtained by `input:type=file`

```shell
// fixImgFile(file, compressOption)

fixImgFile(file, {
    width:500,      // default unlimited
    height:500,     // default unlimited
    ratio: 0.92     // default no compression
}).then(base64 => {
    document.getElementById('iosphoto').src = base64
})
```

Or, fix an img element

```shell
//fixBySelector(querySelector)

fixBySelector('#iosphoto')
```

## License

MIT