import Config from 'configucius';

const config = new Config({
  configFile: '~/.pocal',
  options: {
    clientUrlReplace: {
      default: [],
      save: true,
    },
    keywords: {
      default: [],
      save: true,
    },
    plugins: {
      type: 'array',
      default: ['youtube'],
      save: true,
    },
    youtubeDownloadsDir: {
      type: 'string',
      default: '~/videos/downloads',
      save: true,
    },
    host: {
      type: 'string',
      save: true,
    },
    port: {
      type: 'number',
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

export default config;
