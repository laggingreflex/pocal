import Config from 'configucius';

const config = new Config({
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
