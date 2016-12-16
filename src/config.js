import Config from 'configucius';

const config = new Config({
  configFile: '~/.pocal',
  duplicateArgumentsArray: false,
  mergeDefaults: true,
  options: {
    clientUrlReplace: {
      default: [],
      save: true
    },
    host: {
      save: true,
      type: 'string'
    },
    ip: {
      save: true,
      type: 'string'
    },
    keywords: {
      default: [],
      save: true
    },
    port: {
      save: true,
      type: 'number'
    },
    sslCert: {
      save: true,
      type: 'string'
    },
    sslKey: {
      save: true,
      type: 'string'
    }
  }
});

export default config;
