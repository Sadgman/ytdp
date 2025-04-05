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
            {name: 'ytdl', instance: new ytdl()},
            {name: 'snapany', instance: new snapany()},
            {name: 'savefromnet', instance: new savefromnet()}
        ];
    }
    async download(url, outputFilePath, type = 'audio', cook = null){
        for(const strategy of this.strategies){
            try{
                await strategy.instance.createPage(url, outputFilePath, type, cook);
                return true;
            } catch(e){
                console.error(`Error en ${strategy.name} : ${e.message}`);
            }
        }
        return new Error('No se pudo descargar el video con ninguna estrategia.');

    }

}
module.exports = new manager();