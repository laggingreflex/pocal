import Config from 'configucius';

const config = new Config({
  duplicateArgumentsArray: false,
  mergeDefaults: true,
  options: {
    host: {
      type: 'string'
    }
  }
});

export default config;
