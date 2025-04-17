const savefromnet = require('../index');
const fs = require('fs');

// savefromnet.download('https://youtube.com/shorts/a79CFiVsHNk?si=PW1dOxwpu5tk1EXK', 'audio.mp3', 'audio')

// savefromnet.download('https://www.youtube.com/shorts/HvootjFlBAY', 'audio2.mp3', 'audio')
(async ()=>{
    await savefromnet.download('https://youtu.be/1-OWHonkKvo?si=CUq1qiNUg7D8xuJm', 'audio3.mp3', 'audio')
})()

// savefromnet.download('https://youtu.be/hpl704EFyx4?si=w0wbnvnhPhYE9ju0', 'audio4.mp3', 'audio')

console.log("salio de todo eso");

if(fs.existsSync('audio2.mp3')){
    fs.readFileSync('audio2.mp3');
}
if(fs.existsSync('audio.mp3')){
    fs.readFileSync('audio.mp3');
}
if(fs.existsSync('audio3.mp3')){
    fs.readFileSync('audio3.mp3');
}
if(fs.existsSync('audio4.mp3')){
    fs.readFileSync('audio4.mp3');
}
