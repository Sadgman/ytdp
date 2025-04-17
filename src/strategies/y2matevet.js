const base = require('../core/base.js');

class y2matevet extends base {
    async createPage(url, outputFilePath, type = 'audio') {
        let page;
        try{
            page = await super.createPage(); 
            await page.goto('https://y2mate.vet/es/youtube-to-mp3/');
            await page.waitForSelector(".search-bar");
            await page.type("#url", url);
            await page.click(".submit");
            await page.waitForSelector(".btn-submit");
            await page.click(".btn-submit");
            await page.waitForSelector('iframe');
            const iframeElement = await page.$('iframe');
            const iframe = await iframeElement.contentFrame();
            let link;

            if (type === 'video') {
                await iframe.waitForSelector('li.tab-link.MP4');
                await iframe.click('li.tab-link.MP4');
                await iframe.waitForSelector('tbody tr td');
                await iframe.waitForFunction(() => {
                    const element = document.querySelector('tbody tr td div[data-url]');
                    return element && element.getAttribute('data-url') !== '';
                });
                link = await iframe.evaluate(() => {
                    const row = Array.from(document.querySelectorAll('tbody tr')).find(tr => {
                        const resolutionCell = tr.querySelector('th p');
                        return resolutionCell && resolutionCell.textContent.trim() === '360p';
                    });
                    if (row) {
                        const div = row.querySelector('td div[data-url]');
                        return div ? div.getAttribute('data-url') : null;
                    }
                    return null;
                });

                if (!link) {
                    throw new Error('No se encontró la URL para la resolución 360p.');
                }
            } else {
                await iframe.waitForSelector('tbody tr td');
                await iframe.evaluate(() => {
                    const getdownloadsbuttons = document.querySelectorAll('tbody tr td div');
                    const l = getdownloadsbuttons[getdownloadsbuttons.length - 1];
                    l.id = 'lowest';
                });
                await iframe.click('tbody tr td div #lowest');
                await iframe.waitForSelector('.download_btn a');
                await iframe.waitForFunction(() => {
                    const element = document.querySelector('.download_btn a');
                    return element && element.href !== '';
                });
                link = await iframe.evaluate(() => {
                    const getdownloadsbutton = document.querySelector('.download_btn a');
                    return getdownloadsbutton.href;
                });
            }
            await this.download(link, outputFilePath, type);
            return true;
        }catch(e){
            throw new Error('Error en y2matevet: ' + e.message);
        }finally {
            if(page) await page.close();
        }
    }
}

module.exports = y2matevet;