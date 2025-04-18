# Ytdp Social Media Downloader

This a package for Download Audio and Video from different Social Media: Youtube, Instagram, Tiktok, etc.

# Installation
```bash
npm install ytdp
```

# Basic Use 

This will download the file to the current directory
```js
const ytdp = require('ytdp');

(async () =>{
    await ytdp.download('gogogo meme', 'video');
})
```
Example for download with url

```js 
const ytdp = require('ytdp');

(async () => {
    const url = 'https://youtu.be/pElHHasBZfo?si=v6iQivEKQsew2fEB';
    await ytdp.download(url, 'audio');
})
```
File with custom name
```js
const ytdp = require('ytdp');

(async () => {
    await ytdp.download('gogogo', 'audio', './jorgito.mp3', { AutoFileNameID: false });
})
```