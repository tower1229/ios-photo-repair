let {
    fixBySelector,
    fixImgFile
} = require("../../src/fixer.js")

window.onload = function () {
    fixBySelector('#iosphoto')
}

document.getElementById('fileinput').onchange = function (evt) {
    let file = evt.target.files[0];
    console.log(file);

    fixImgFile(file, {
        maxWidth: 500
    }).then(res => {
        console.log(res)
        document.getElementById('iosphoto').src = res
    })
}
