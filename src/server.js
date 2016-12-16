import Koa from 'koa';
import portscanner from 'portscanner';
import config from './config';
import {log, reqLog, getHostString} from './utils';
import * as routes from './routes'; // eslint-disable-line

const app = new Koa();

app.use(reqLog);
for (const [, route] of Object.entries(routes)) {
  app.use(route);
}

const defaultIp = config.ip || '127.0.0.1';
const defaultPort = config.port || 6000;

const listeningHost = {};

export default async({
  silent = config.silent,
  ip = defaultIp,
  port: argPort
} = {}) => {
  let port = argPort || defaultPort;

  const portStatus = await portscanner.checkPortStatus(port, ip);

  if (portStatus !== 'closed') {
    if (argPort) {
      throw new Error(`Cannot listen on ${ip}:${port}`); // eslint-disable-line
    } else {
      if (!silent) log.warn(`Warning: ${ip}:${port} is busy`); // eslint-disable-line
      port = await portscanner.findAPortNotInUse(6000, 6010, ip);
    }
  }

  return app.listen(port, ip, () => {
    if (!silent) {
      log('Listening on', getHostString(port, ip));
    }
    listeningHost.ip = ip;
    listeningHost.port = port;
  });
};

export const getListeningHost = () => {
  const {port, ip} = listeningHost;

  return getHostString(port, ip);
};
