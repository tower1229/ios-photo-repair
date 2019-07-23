let EXIF = require("exif-js")
const getURLBase64 = function(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.responseType = 'blob'
        xhr.onload = function() {
            if (this.status === 200) {
                let blob = this.response
                let fileReader = new FileReader()
                fileReader.onloadend = function(e) {
                    let result = e.target.result
                    resolve(result)
                }
                fileReader.readAsDataURL(blob)
            }
        }
        xhr.onerror = function() {
            reject()
        }
        xhr.send()
    })
}

const getOri = function(file) {
    return new Promise(resolve => {
        EXIF.getData(file, function() {
            let orientation = EXIF.getTag(this, "Orientation");
            resolve(orientation)
        });
    })
}

const imgToCanvas = function(img, orientation) {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        targetWidth = img.targetWidth || img.width,
        targetHeight = img.targetHeight || img.height;
    
    if (orientation === 6) {
        canvas.width = targetHeight;
        canvas.height = targetWidth;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 180 * 90);
        ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, canvas.height, canvas.width);
    } else {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    return new Promise(resolve => {
        resolve(canvas)
    })
}

export const fixBySelector = function(selector) {
    const fixImg = function(img) {
        if (!img.dataset.iosfixed) {
            getOri(img).then(orientation => {
                if (orientation == 6) {
                    imgToCanvas(img, orientation).then(canvas => {
                        try{
                            img.src = canvas.toDataURL();
                            img.dataset.iosfixed = true;
                        }catch(e) {
                            getURLBase64(img.src).then(base64 => {
                                img.onload = function() {
                                    if (!img.dataset.iosfixed) {
                                        imgToCanvas(img, orientation).then(canvas => {
                                            img.src = canvas.toDataURL();
                                            img.dataset.iosfixed = true
                                        })
                                    }
                                }
                                img.src = base64;
                            })
                        }
                    })
                }
            })
        }
    }
    let imgs = document.querySelectorAll(selector)
    if (imgs.length) {
        for (let i = 0; i < imgs.length; i++) {
            let img = imgs[i]
            if (img.tagName.toLowerCase() === 'img') {
                img.crossOrigin = "Anonymous";
                if (img.complete) {
                    fixImg(img)
                } else {
                    img.onload = function() {
                        fixImg(img)
                    }
                }
            }
        }

    } else {
        console.log('fixer WARN no files:' + selector)
    }
}

const computeSize = function(originWidth, originHeight, maxWidth, maxHeight) {
    let targetWidth = originWidth,
        targetHeight = originHeight;
    const setWidth = function() {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        },
        setHeight = function() {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }

    if (maxWidth && maxHeight) {
        //限定区间
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽
                setWidth()
            } else {
                // 更高
                setHeight()
            }
        }
    } else if (maxWidth) {
        //限定宽度
        setWidth()
    } else if (maxHeight) {
        //限定高度
        setHeight()
    }

    return {
        width: targetWidth,
        height: targetHeight
    }
}

export const fixImgFile = function(file, option) {
    const opt = Object.assign({
        ratio: 2
    }, option || {})

    return new Promise(resolve => {
        if (file.type.indexOf('image') === 0) {
            getOri(file).then(orientation => {
                let oReader = new FileReader();
                oReader.onload = function(e) {
                    let base64 = e.target.result;
                    let img = document.createElement('img');

                    img.onload = function() {
                        if (opt.width || opt.height) {
                            let compressSize;
                            if (orientation === 6) {
                                compressSize = computeSize(img.height, img.width, opt.width, opt.height)
                                img.targetWidth = compressSize.height;
                                img.targetHeight = compressSize.width;
                            } else {
                                compressSize = computeSize(img.width, img.height, opt.width, opt.height)
                                img.targetWidth = compressSize.width;
                                img.targetHeight = compressSize.height;
                            }

                        }
                        imgToCanvas(img, orientation).then(canvas => {
                            resolve(canvas.toDataURL('image/jpeg', opt.ratio))
                        })
                    }
                    img.src = base64;
                }
                oReader.readAsDataURL(file);
            })
        }
    })

}