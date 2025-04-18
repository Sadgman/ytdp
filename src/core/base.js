const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const { PassThrough, Readable } = require('stream');
const UserAgent = require('user-agents');

class base {
    static browser = null;
    static browserPromise = null; 
    static validPages = [
        'about:blank',
        'y2mate',
        'snapany',
        "savefrom"
    ]
    constructor() {
        this.browserpath = '/usr/bin/google-chrome-stable';
    }

    static async launchBrowser() {
        if (base.browser) {
            return base.browser;
        }
    
        if (base.browserPromise) {
            return base.browserPromise;
        }
    
        base.browserPromise = puppeteer.launch({
            headless: true, 
            executablePath: '/usr/bin/google-chrome-stable',
            defaultViewport: null,
            userDataDir: __dirname + '/data/user',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure',
                '--disable-privacy-sandbox'
            ],
        });
    
        base.browser = await base.browserPromise;
    
        base.browser.on('targetcreated', async (target) => {
            const page = await target.page();
            if (page) {
                const url = page.url();
                if(!base.validPages.some(validPage => url.includes(validPage))) {
                    await page.close();
                }
            }
        });
    
        base.browserPromise = null;
        return base.browser;
    }

    async createPage() {
        const browser = await base.launchBrowser(); 
        const page = await browser.newPage();
        const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
        await page.setUserAgent(userAgent);

        return page;
    }
    /**
     * Descarga el video o audio desde la URL proporcionada y lo guarda en el archivo de salida especificado.
     */
    async download(url, outputFilePath, type) {
        try {
            let nodeStream; 
            if(url instanceof Readable){
                nodeStream = url;
            }
            else{
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error al descargar el archivo: ${response.statusText}`);
                }

                nodeStream = Readable.fromWeb(response.body);
            }
            const passThrough = new PassThrough();
            nodeStream.pipe(passThrough);

            return new Promise((resolve, reject) => {
                const command = ffmpeg(passThrough);

                if (type === 'audio') {
                    command
                        .audioCodec('libmp3lame')
                        .audioBitrate(128)
                        .toFormat('mp3');
                } else {
                    command
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .toFormat('mp4');
                }

                command
                    .on('end', () => {
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error(`Error durante la conversión a ${type.toUpperCase()}:`, err);
                        reject(err);
                    })
                    .save(outputFilePath);
            });
        } catch (e) {
            throw new Error(`Error durante la descarga ${e.message}`);
        }
    }
    /**
     * Cierra el navegador si está abierto.
     * @returns {Promise<boolean>} true si el navegador se cierra, false si no estaba abierto.
     */
    async closeBrowser() {
        if (base.browser) {
            try{
                await base.browser.close();
            }catch(e){
                throw new Error(`Error al cerrar el navegador: ${e.message}`);
            }
            base.browser = null;
            base.browserPromise = null;
            return true;
        }
        return false;
    }
}

module.exports = base;