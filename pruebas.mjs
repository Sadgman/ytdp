import fetch from 'node-fetch';
import fs from 'fs';

async function apiVideo(url){
  return new Promise(async (resolve, reject) => {
    url = `https://yt-api.p.rapidapi.com/resolve?url=${url}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'ad23be9ec4msh4e5101f259dcd76p175c61jsn74ad6a774173',
        'x-rapidapi-host': 'yt-api.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      let result = await response.text();
      result = JSON.parse(result);
      url = `https://yt-api.p.rapidapi.com/dl?id=${result?.videoId}`;
      const response2 = await fetch(url, options);
      result = await response2.text();
      result = JSON.parse(result);
      resolve(result.adaptiveFormats[18].url);

    } catch (error) {
      console.error(error);
    }
  });
}
(async () => {
  const url = await apiVideo('https://www.youtube.com/watch?v=fLDqYqoHC8I');
  fetch(url).then(res => {
    const dest = fs.createWriteStream('video.mp3');
    res.body.pipe(dest);
  })
})()