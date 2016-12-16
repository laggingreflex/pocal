import 'source-map-support/register'; // eslint-disable-line import/no-unassigned-import
import createServer from './server';
import config from './config';

// console.log(config.get());
// if (config.nodeEnv && config.nodeEnv.match(/dev/i)) {
// }
config.set('debug', true);

const main = async() => {
  if (config.get('editConfig')) {
    await config.prompt();
    config.save();
  } else if (config.get('editConfig')) {
    await config.prompt();
    config.save();
  } else {
    createServer();
  }
};

main();
