const base = require('../core/base');

class ytsearch extends base {
    /**
     * 
     * @param {string} data 
     * @returns {Promise<string[]>} devuelve un array de urls de videos de youtube
     */
    async createPage(data, limit = 1) {
        const page = await super.createPage();
        await page.goto(`https://www.youtube.com/results?search_query=${data}`);
        await page.waitForSelector('a#video-title');
        const href = await page.evaluate(() => {
            const element = document.querySelectorAll('a#video-title');
            let hrefs = [];
            for(let i=0; i<= element.length-1; i++){
                hrefs.push(element[i].href);
            }
            return element ? hrefs : null;
        });
        await page.close();
        return href.slice(0, limit);
    }
    /**{
     * 
     * @param {string} url 
     * @returns devuelve el ID del video de youtube
     */
    async getVideoIdYt(url){
        // Si la url tiene dos signos de igual, devuelve el texto entre los dos signos de igual
        if(url.match(/=/g)?.length === 2) return url.match(/(?<==)[^=]+(?==)/)[0];
        // retorna el id buscando el signo de igual, devuelve todo lo de despues y si no lo encuentra
        // busca / y devuelve lo que hay despues
        return url.match(/(?<==).+(?!(.*[^/]+$))|([^/]+$)(?<!.*(?<==).+)/)[0];
    }
    /**
     * 
     * @param {string} url 
     * @returns {boolean} true si la url es valida
     */
    async ValidateUrlYt(url){
        // Valida si la url es de youtube
        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
    }
}
module.exports = ytsearch;