'use strict';
const base = require('./src/core/base.js');
const y2matevet = require('./src/strategies/y2matevet');
const ytdl = require('./src/strategies/ytdl');
const snapany = require('./src/strategies/snapany');
const savefromnet = require('./src/strategies/savefromnet');
let ytutil = require('./src/utils/ytutil');
ytutil = new ytutil();

class manager extends base{
    constructor(){
        super();
        this.SearchYt = ytutil.createPage;
        this.getVideoId = ytutil.getVideoIdYt;
        this.ValidateUrl = ytutil.ValidateUrlYt;
        this.strategies = [
            {name: 'y2matevet', instance: new y2matevet()},
            {name: 'snapany', instance: new snapany()},
            {name: 'ytdl', instance: new ytdl()},
            {name: 'savefromnet', instance: new savefromnet()}
        ];
    }
    /**
     * 
     * @param {string} url url del video de youtube o el nombre del video
     * @param {string} type tipo de descarga 'audio' o 'video'
     * @param {string} outputFilePath directorio donde se guardara el video
     * @param {object} options { cook: cookies, AutoFileNameID: true o false da un nombre automático , AutoSearch: true o false, busca el video }
     * @returns {Promise<boolean>} true si se descargo el video
     */
    async download(url, type = 'audio', outputFilePath='', options = { cook: null, AutoFileNameID: true, AutoSearch: true }) {
        if(options.AutoSearch) url = await this.ValidateUrl(url) ? url : (await this.SearchYt(url))[0];
        outputFilePath = options.AutoFileNameID? outputFilePath + (await this.getVideoId(url)) + (type === 'audio'? '.mp3' : '.mp4'): outputFilePath;

        for(const strategy of this.strategies){
            try{
                await strategy.instance.createPage(url, outputFilePath , type, options.cook);
                return outputFilePath;
            } catch(e){
                console.error('Error en la estrategia ' + strategy.name + ' reintentando...');
            }
        }
        return new Error('No se pudo descargar el video con ninguna estrategia.');

    }

}
module.exports = new manager();