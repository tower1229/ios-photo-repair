let EXIF = require("exif-js")

const getOri = function(file){
    return new Promise(resolve => {
        EXIF.getData(file, function() {
            let orientation = EXIF.getTag(this, "Orientation");
            resolve(orientation)
        });
    })
}

const imgToCanvas = function(img, orientation){
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    if(orientation===6){
        canvas.width = img.height;
        canvas.height = img.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 180 * 90);
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    }else{
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
    }
    
    return new Promise(resolve => {
        resolve(canvas)
    })
}

export const fixBySelector = function(selector) {
    let imgs = document.querySelectorAll(selector)
    if(imgs.length){
        for(let i = 0;i<imgs.length;i++){
            let img = imgs[i]
            if(img.tagName.toLowerCase() === 'img'){
                img.onload = function(){
                    if(!img.dataset.iosfixed){
                        getOri(img).then(orientation => {
                            if (orientation == 6) {
                                imgToCanvas(img, orientation).then(canvas => {
                                    img.dataset.iosfixed = true
                                    img.src = canvas.toDataURL('image/png');
                                })
                            }
                        })
                    }
                }
            }
            
        }
        
    }else{
        console.log('fixer WARN no files:' + selector)
    }    
}

const computeSize = function(originWidth, originHeight, maxWidth, maxHeight){
    let targetWidth = originWidth,
        targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更宽，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
    }
    return {
        width: targetWidth,
        height: targetHeight
    }
}

export const fixImgFile = function(file, option) {
    return new Promise(resolve => {
        if(file.type.indexOf('image')===0){
            getOri(file).then(orientation => {
                let oReader = new FileReader();
                oReader.onload = function(e) {
                    let base64 = e.target.result;
                    let img = document.createElement('img');
                    
                    img.onload = function(){
                        const canvas = document.createElement('canvas'),
                            ctx = canvas.getContext('2d');
                        
                        if(option && option.width && option.height){
                            let compressSize = computeSize(img.width, img.height, option.width, option.height)
                            img.width = compressSize.width;
                            img.height = compressSize.height;
                        }
                        imgToCanvas(img, orientation).then(canvas => {
                            resolve( canvas.toDataURL() )
                        })
                    }
                    img.src = base64;
                }
                oReader.readAsDataURL(file);
            })
        }
    })

}