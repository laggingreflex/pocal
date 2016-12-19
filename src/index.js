import 'source-map-support/register'; // eslint-disable-line import/no-unassigned-import
import createServer from './server';
import config from './config';
import { loadPlugins } from './utils';

const main = async() => {
  if (config.get('editConfig')) {
    await config.prompt();
    config.save();
    console.log('Config saved');
    return;
  }

  loadPlugins(config.get('plugins'));

  createServer();
};

main();
