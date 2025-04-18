const base = require('../core/base');

class snapany extends base {
    constructor() {
        super();
    }

    async createPage(url, outputFilePath, type = 'audio') {
        let page;
        try{
            page = await super.createPage(); // Reutiliza el navegador compartido
            await page.goto('https://snapany.com/');
            await page.type("input", url);
            await page.click('span .whitespace-nowrap');

            await page.waitForSelector('a');
            const buttonSelector = type === 'audio'
                ? '.group.relative.flex.items-center.justify-center.text-center.font-medium.focus\\:z-10.focus\\:outline-none.\\[\\&\\>span\\]\\:rounded-lg.border.border-transparent.bg-purple-700.text-white.focus\\:ring-4.focus\\:ring-purple-300.enabled\\:hover\\:bg-purple-800.dark\\:bg-purple-600.dark\\:focus\\:ring-purple-900.dark\\:enabled\\:hover\\:bg-purple-700.rounded-lg'
                : await (async () => {
                    const buttonVideo1 = 'a.group.relative.flex.items-center.justify-center.text-center.font-medium.focus\\:z-10.focus\\:outline-none.\\[\\&\\>span\\]\\:rounded-lg.bg-blue-700.text-white.hover\\:bg-blue-800.focus\\:ring-4.focus\\:ring-blue-300.dark\\:bg-blue-600.dark\\:hover\\:bg-blue-700.dark\\:focus\\:ring-blue-800.rounded-lg';
                    const buttonVideoExist = await page.$(buttonVideo1);
                    if (buttonVideoExist) {
                        return buttonVideo1;
                    }
                    await page.waitForSelector('a.flex.items-center.justify-center.w-full.p-\\[10px\\].text-sm');
                    const n = await page.evaluate(() => {
                        const element = Array.from(document.querySelectorAll('a.flex.items-center.justify-center.w-full.p-\\[10px\\].text-sm')).find(a => {
                            const span = a.querySelector('span');
                            return span && span.textContent.includes('360'); 
                        });
                        element.className = 'roberto360'; 
                    
                        return element ? element.className : null;
                    });
                    return '.' + n;
                })();

            await page.waitForSelector(buttonSelector, { visible: true });

            // Obtener el link del elemento
            const href = await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element ? element.getAttribute('href') : null;
            }, buttonSelector);

            if (!href) {
                throw new Error('No se encontró el enlace para descargar.');
            }

            await this.download(href, outputFilePath, type);
            return true;
        }catch(e){
            throw new Error('Error en snapany: ' + e.message);
        } finally {
            if(page) await page.close();
        }
    }
}

module.exports = snapany;