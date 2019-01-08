English | [中文](README_CN.md)

# ios-photo-repair

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
    width:500,
    height:500
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