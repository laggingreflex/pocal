import logi from 'debug-logi/create';
import ms from 'ms';
import padLeft from 'pad-left';
import padRight from 'pad-right';
import _ from 'lodash';
import config from '../config';

const reqLog = logi('req', config);
let reqCounter = 0;

export default async(ctx, next) => {
  ctx.log = reqLog;

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
    ctx.log.verb(req, 'Waiting...');
  }, 1000);

  const startTime = new Date();
  let endTime;

  try {
    // eslint-disable-next-line callback-return
    await next();
    endTime = new Date();
  } catch (err) {
    endTime = new Date();
    if (config.debug) {
      ctx.log.err(err);
      ctx.body = err.stack;
    } else {
      ctx.log.err(err.message);
      ctx.body = 'Something went wrong. ' + err.message;
    }
  }
  clearTimeout(timeout);
  ctx.log(req, 'Finished in', ms(endTime - startTime));
};
