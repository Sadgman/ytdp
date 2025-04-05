const ytutil = require('../utils/ytutil');
const yt = require('@distube/ytdl-core');

class ytdl extends ytutil {
    async getLinkoDownload(url, outputFilePath, type = 'audio', cook = null){
        const stream =  super.ValidateUrlYt(url) ? type == 'audio' ? yt(url, { filter: 'audioonly', agent: cook }) : yt(url, { filter: 'videoonly', agent: cook }) : null;
        if (!stream) {
            throw new Error('No se encontró el enlace para descargar.');
        }
        this.download(stream, outputFilePath, type);
    }
}
module.exports = ytdl;