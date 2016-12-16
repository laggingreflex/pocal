import path from 'path';
import {renderFile} from 'pug';
import config from '../config';

export default (filename, opts = {}) => {
  return renderFile(path.join(__dirname, filename), {
    cache: !config.debug,
    pretty: config.debug,
    ...opts
  });
};
