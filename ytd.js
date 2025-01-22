const pup = require('puppeteer');
const { setTimeout } = require('timers')
const sleep = ms => new Promise(res => setTimeout(res, ms));


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

/**
 * 
 * @param {string} url Url of the video
 * @returns returns the download link
 */
async function YTDownloadMusic(url) {
  const browser = await pup.launch({
    headless: true,
    defaultViewport: null
  });
  const page = await browser.newPage();

  browser.on('targetcreated', async (target) => {
    const page = await target.page(); 
    if(page){
      const url = await page.url();
      await page.close();
    }
  });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15')
  await page.goto('https://www.y2mate.onl/es/youtube-to-mp3/')
  await page.waitForSelector('#search_form #keyword');
  await page.type('#search_form #keyword', url);
  await page.click('#submit');
  await page.waitForSelector('#submit-form');
  await page.click('#submit-form');

  await page.waitForSelector('iframe')
  const iframeElement = await page.$('iframe');
  const iframe = await iframeElement.contentFrame();
  await iframe.waitForSelector('tbody tr td');
  let l;
  await iframe.evaluate(() => {
    const getdownloadsbuttons = document.querySelectorAll('tbody tr td div');
    
    l = getdownloadsbuttons[getdownloadsbuttons.length - 1]
    l.id = 'lowest'
  });
  await iframe.click('tbody tr td div #lowest')
  await page.waitForSelector('iframe')
  const iframe2 = await iframeElement.contentFrame();
  await sleep(6000);
  iframe2.waitForSelector('.download_btn a')
  await sleep(6000);
  return new Promise(async (resolve, reject) => {
    try {
      const link = await iframe2.evaluate(() => {
        const getdownloadsbutton = document.querySelector('.download_btn a');
        console.log(getdownloadsbutton);
        return getdownloadsbutton.href;
      });
      await browser.close();
      if(link === '') {
        try{
          const urldown = await apiVideo(url);
          resolve(urldown);
        } catch(err) {
          YTDownloadMusic(url);
          reject(err);
        }
      }else{
        resolve(link);
      }
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = YTDownloadMusic;