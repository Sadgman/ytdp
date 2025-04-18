const ytdp = require('../index');

// savefromnet.download('https://youtube.com/shorts/a79CFiVsHNk?si=PW1dOxwpu5tk1EXK', 'audio.mp3', 'audio')

// savefromnet.download('https://www.youtube.com/shorts/HvootjFlBAY', 'audio2.mp3', 'audio')
(async ()=>{
    // await ytdp.download('https://www.youtube.com/watch?v=uKxyLmbOc0Q&list=RDGMEMXdNDEg4wQ96My0DhjI-cIgVMuKxyLmbOc0Q&start_radio=1', 'audio3.mp4', 'video')
    const outputFilePath = await ytdp.download('gogogo meme', 'video', './src/');
    // const outputFilePath = await ytdp.download('https://www.youtube.com/shorts/HvootjFlBAY', 'audio', './src/jorgito.mp3', {AutoFileNameID: false, AutoSearch: false});
    // const url = await ytdp.download('https://www.youtube.com/shorts/HvootjFlBAY', 'audio', './src/jorgito.mp3', {AutoFileNameID: false, AutoSearch: false});
    // const outputFilePath = await ytdp.strategies[2].instance.createPage('https://www.youtube.com/shorts/HvootjFlBAY', 'audio.mp4', 'video');
    console.log(outputFilePath);

})()

// savefromnet.download('https://youtu.be/hpl704EFyx4?si=w0wbnvnhPhYE9ju0', 'audio4.mp3', 'audio')

console.log("salio de todo eso");
