const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const {downloadZip,downloadXML} = require('./lib/download.js')
const {process} = require('./lib/process.js')


exports.run = async ({ pluginConfig, processingConfig, processingId, dir, tmpDir, axios, log, patchConfig, ws }) => {

    let dataset
    // check the current state of the dataset
    if (processingConfig.datasetMode === 'create') {
        await log.step('Création du jeu de donnée')
        if (processingConfig.dataset.id) {
        try {
            await axios.get(`api/v1/datasets/${processingConfig.dataset.id}`)
            throw new Error('le jeu de données existe déjà')
        } catch (err) {
            if (err.status !== 404) throw err
        }
        dataset = (await axios.put('api/v1/datasets/' + processingConfig.dataset.id)).data
        } else {
        dataset = (await axios.post('api/v1/datasets')).data
        }
        await log.info(`jeu de donnée créé, id="${dataset.id}", title="${dataset.title}"`)
    } else if (processingConfig.datasetMode === 'update') {
        await log.step('Vérification du jeu de données')
        try {
        dataset = (await axios.get(`api/v1/datasets/${processingConfig.dataset.id}`)).data
        await log.info(`le jeu de donnée existe, id="${dataset.id}", title="${dataset.title}"`)
        } catch (err) {
        if (!dataset) throw new Error(`le jeu de données n'existe pas, id ${processingConfig.dataset.id}`)
        }
    }

    await downloadXML(pluginConfig,dir,axios,log);
    await process(processingConfig,dir,axios,log);
    
}