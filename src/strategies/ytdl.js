const ytutil = require('../utils/ytutil');
const yt = require('@distube/ytdl-core');

class ytdl extends ytutil {
    async createPage(url, outputFilePath, type = 'audio', cook = null){
        try{
            const stream =  super.ValidateUrlYt(url) ? yt(url, { filter: (type == 'audio' ? 'audioonly' : 'video'), agent: cook }) : null;
            if (!stream) {
                throw new Error('No se encontró el enlace para descargar.');
            }
            await this.download(stream, outputFilePath, type);
        }catch(e){
            throw new Error('Error en ytdl: ' + e.message);
        }
    }
}
module.exports = ytdl;