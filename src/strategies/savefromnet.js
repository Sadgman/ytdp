const base = require('../core/base');
const sharp = require('sharp');
const readline = require('readline-sync');

class savefromnet extends base {

    async captchaResolve(page) {
        // no se me ocurre otra forma de resolver el captcha, si alguien tiene una mejor idea, acepto pull requests
        console.log('Si crees que resolviste el captcha, presiona ENTER de nuevo para continuar\nSe debe reiniciar el script al reiniciar el captcha.');
        while (true) {
            try{
                await page.waitForSelector('.captcha-dialog__form', { timeout: 10000 });
                const o = await page.evaluate(() => {
                    const element = document.querySelector('.captcha-dialog__form');
                    return element && element.style.display !== 'none';
                }, { timeout: 5000 }); 
                if (!o) {
                    console.log('Captcha no encontrado, esperando...');
                    break;
                }
                console.log('Captcha encontrado, resolviendo...');
           

                const imgcaptcha = await page.evaluate(() => {
                    const captchaImg = document.querySelector('img[alt=Captcha]');
                    const input = document.querySelector('.captcha-dialog__input__ctr input[name=val]');
                    if (input) input.value = ''; 
                    return captchaImg ? captchaImg.src : null;
                });
        
                const response = await fetch(imgcaptcha);
                const html = await response.text();
        
                await sharp(Buffer.from(html))
                .resize(284, 95) 
                .composite([
                    {
                        input: Buffer.from(
                            `<svg xmlns="http://www.w3.org/2000/svg" width="${284}" height="${95}">
                                <rect width="100%" height="100%" fill="white"/>
                            </svg>`
                        ),
                        blend: 'dest-over',
                    },
                ])
                .png()
                .toFile('../data/captcha.png');

                const terminalImage = await import('terminal-image');
                console.log(await terminalImage.default.file('../data/captcha.png', { width: '80%', height: '80%' }));
                const captcha = readline.question('Captcha: ');
                await page.type('.captcha-dialog__input__ctr input[name=val]', captcha);
                await page.click('.captcha-dialog__button');
            }catch(e){
                console.log('Captcha resuelto, esperando...');
                break;
            }

        }
    }
    async createPage(url, outputFilePath, type = 'audio') {
        let page;
        try{
            page = await super.createPage();
            await page.goto('https://en.savefrom.net');
            await page.waitForSelector('input[name=sf_url]');
            await page.type('input[name=sf_url]', url);
            await page.click('#sf_submit');

            await this.captchaResolve(page);
            if(fs.existsSync('../data/captcha.png')) fs.unlinkSync('../data/captcha.png');
            
            let href;
            while(true){
                href = await page.evaluate(() => {
                    document.querySelector("form[action='/savefrom.php']").submit();
                    const element = document.querySelector('a.link.link-download.no-downloadable.subname.ga_track_events');
                    return element ? element.href : null;
                }, { timeout: 5000 });
                if(href !== null){
                    break;
                }
            }
            
            await this.download(href, outputFilePath, type);
            return true;
        }catch(e){
            return new Error('Error en savefromnet: ' + e.message);
        }finally {
            if(page) await page.close();
        }
    }
}
module.exports = savefromnet;