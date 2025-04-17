const ytdp = require('../index');
const fs = require('fs');

// savefromnet.download('https://youtube.com/shorts/a79CFiVsHNk?si=PW1dOxwpu5tk1EXK', 'audio.mp3', 'audio')

// savefromnet.download('https://www.youtube.com/shorts/HvootjFlBAY', 'audio2.mp3', 'audio')
(async ()=>{
    await ytdp.download('https://www.youtube.com/watch?vif(url.match(/=/g)?.length === 2) return url.match(/(?<==)[^=]+(?==)/)[0];=uKxyLmbOc0Q&list=RDGMEMXdNDEg4wQ96My0DhjI-cIgVMuKxyLmbOc0Q&start_radio=1', 'audio3.mp4', 'video')
    if(fs.existsSync('audio3.mp4')){
        console.log("el archivo existe");
    }
})()

// savefromnet.download('https://youtu.be/hpl704EFyx4?si=w0wbnvnhPhYE9ju0', 'audio4.mp3', 'audio')

console.log("salio de todo eso");
