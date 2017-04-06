var Config = require('configucius').default;
var sample = require('./config.sample.json');

const config = module.exports = new Config({
  configFile: '~/.pocal',
  options: {
    clientUrlReplace: {
      default: sample.clientUrlReplace,
      save: true,
    },
    keywords: {
      default: sample.keywords,
      save: true,
    },
    plugins: {
      type: 'array',
      default: sample.plugins,
      save: true,
    },
    youtubeDownloadsDir: {
      type: 'string',
      default: sample.youtubeDownloadsDir,
      save: true,
    },
    host: {
      type: 'string',
      save: true,
    },
    port: {
      type: 'number',
      default: sample.port,
      save: true,
    },
    ip: {
      type: 'string',
      save: true,
    },
    sslKey: {
      type: 'string',
      save: true,
    },
    sslCert: {
      type: 'string',
      save: true,
    },
  },
  duplicateArgumentsArray: false,
  mergeDefaults: true,
});
