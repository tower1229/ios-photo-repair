let {
    fixBySelector,
    fixImgFile
} = require("../../dist/fixer.js")

fixBySelector('#iosphoto')

document.getElementById('fileinput').onchange = function(evt){
    let file = evt.target.files[0]
    fixImgFile(file, {
        width:500,
        height:500
    }).then(res => {
        document.getElementById('iosphoto').src = res
    })
}
