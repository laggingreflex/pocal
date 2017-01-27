import https from 'httpolyglot';
import Koa from 'koa';
import portscanner from 'portscanner';
import body from 'koa-body';
import pem from 'pem-promise';
import config from './config';
import { log, reqLog, getHostString } from './utils';
import * as routes from './routes'; // eslint-disable-line

const app = new Koa();

app.use(reqLog);
app.use(body());
app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  return next();
});
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

  if (!config.sslKey || !config.sslCert) {
    const { serviceKey, certificate } = await pem.createCertificate({ selfSigned: true });

    config.sslKey = serviceKey;
    config.sslCert = certificate;
    await config.save();
  }

  https.createServer({
    cert: config.sslCert,
    key: config.sslKey
  }, app.callback()).listen(port, ip, () => {
    if (!silent) {
      log('Listening on', getHostString(port, ip));
    }
    listeningHost.ip = ip;
    listeningHost.port = port;
  });
  https.createServer({
    cert: config.sslCert,
    key: config.sslKey
  }, app.callback()).listen(443, ip, () => {
    if (!silent) {
      log('Listening on', getHostString(443, ip));
    }
  });
};

export const getListeningHost = () => {
  const { port, ip } = listeningHost;

  return getHostString(port, ip);
};
