import { createLogger } from './log';
import ms from 'pretty-ms';
import padLeft from 'pad-left';
import padRight from 'pad-right';
import _ from 'lodash';
import config from '../../config';

const log = createLogger('req');

let reqCounter = 0;

export default async(ctx, next) => {
  ctx.log = log;

  const id = padLeft(String(reqCounter++), 5, '0');
  const method = padRight(ctx.method, 4, ' ');

  // eslint-disable-next-line no-restricted-syntax
  const req = `[${id}] ${method} ${ctx.url} |`;

  // console.log(_.pick(ctx, [
  //   'header',
  //   'headers',
  //   'method',
  //   'url',
  //   'originalUrl',
  //   'origin',
  //   'href',
  //   'path',
  //   'query',
  //   'querystring',
  //   'host',
  //   'hostname',
  //   'fresh',
  //   'stale',
  //   // 'socket',
  //   'protocol',
  //   'secure',
  //   'ip',
  //   'ips',
  //   'subdomains'])
  // );

  const timeout = setTimeout(() => {
    log.verb(req, 'Waiting...');
  }, 1000);

  const startTime = new Date();
  let endTime;

  try {
    // eslint-disable-next-line callback-return
    await next();
    endTime = new Date();
  } catch (err) {
    endTime = new Date();
    const errMsg = config.debug ? err : err.message;
    const reqMsg = config.debug ? err.stack : 'Something went wrong. ' + err.message;
    log.err(req, errMsg);
    if (ctx.headerSent) {
      ctx.res.end('\n' + reqMsg);
    } else {
      ctx.type = 'text';
      ctx.body = reqMsg;
    }
    if (ctx.info) {
      // log(ctx.info);
    }
  }
  clearTimeout(timeout);
  log(req, 'Finished in', ms(endTime - startTime));
};
