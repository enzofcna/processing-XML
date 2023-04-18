const assert = require('assert');
const config = require('config');
const testUtils = require('@data-fair/processings-test-utils');
const test = require('../lib/download.js');
const axios = require('axios');


describe('Download', function () {
    it('should download a zip', async function () {

      const headers = { 'x-apiKey': config.dataFairAPIKey };

      const axiosInstance = axios.create({
        baseURL: config.dataFairUrl,
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      // Customize axios errors for shorter stack traces when a request fails
      axiosInstance.interceptors.response.use(response => response, error => {
        if (!error.response) return Promise.reject(error);
        delete error.response.request;
        error.response.config = { method: error.response.config.method, url: error.response.config.url, data: error.response.config.data };
        return Promise.reject(error.response);
      });
      const pluginConfig = { url: 'https://donnees.roulez-eco.fr/opendata/instantane', limit: 2500 };
  
      const log = {
        step: (msg) => console.log(`[STEP] ${msg}`),
        error: (msg, extra) => console.error(`[ERROR] ${msg}`, extra),
        warning: (msg, extra) => console.warn(`[WARNING] ${msg}`, extra),
        info: (msg, extra) => console.info(`[INFO] ${msg}`, extra),
        debug: (msg, extra) => console.debug(`[DEBUG] ${msg}`, extra)
      };
      
      var dir='data';
      await test.downloadZip(pluginConfig,dir,axiosInstance,log);
    });
});
