import 'source-map-support/register'; // eslint-disable-line import/no-unassigned-import
import config from '../config';
import { log } from './utils';

const main = async() => {
  if (config.editConfig) {
    await config.prompt(['port', 'youtubeDownloadsDir']);
    config.save();
    console.log(`For advanced setting goto http://localhost:${config.port}`);
    // console.log('Config saved');
    return;
  }

  const { loadPlugins } = require('./utils');
  loadPlugins(config.get('plugins'));
  const createServer = require('./server').default;
  createServer();
};

main().catch(::log.err);
