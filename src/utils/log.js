import logi from 'debug-logi/create';
import config from '../../config';

export const log = logi('pocal', config);

export default log;

export const createLogger = log.createLogger;
