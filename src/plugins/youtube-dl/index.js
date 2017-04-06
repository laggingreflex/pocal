import path from 'path';
import spawn from 'cross-spawn-promise';
import _ from 'lodash';
import request from 'request';
import progress from 'request-progress';
import fs from 'fs-promise';
import untildify from 'untildify';
import { promisify } from 'bluebird';
import prettyBytes from 'pretty-bytes';
import ms from 'pretty-ms';
import youtube from 'youtube-dl';
import linkify from 'linkifyjs/html';
import sanitizeFilename from 'sanitize-filename';
import { createLogger } from '../../utils/log';
import config from '../../../config';

const log = createLogger('plugin:youtube-dl');

const getVer = () => promisify(::youtube.exec)('--version', [], {}).then(o => o.join(''));
let ver = getVer();
const binPath = path.join(path.dirname(require.resolve('youtube-dl/package.json')), 'bin', 'youtube-dl');
const spawned = spawn(binPath, ['-U'], { encoding: 'utf8' })
spawned.then(() => ver = getVer());
spawned.childProcess.stdout.on('data', msg => log(msg.replace(/[\n\r]$/g, '')))
spawned.childProcess.stderr.on('data', msg => log.err(msg.replace(/[\n\r]$/g, '')))

export default async(linkArg, ctx) => {
  /*
    fix youtube/tv
    https://github.com/rg3/youtube-dl/issues/11485
    https://github.com/regexhq/youtube-regex/issues/7
    Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4&resume
    Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4
    Doesn't work: https://www.youtube.com/tv#/watch/video/seek?v=oNXzMBA9VU4
    Doesn't work: https://www.youtube.com/tv#/watch/video/control?v=oNXzMBA9VU4
    Doesn't work: https://www.youtube.com/tv#/watch?v=c7GVeJJcD5w&list=UUFZO6aPugMrZjUOobX7IQDA
    Doesn't work: https://www.youtube.com/tv#/watch/video?v=oNXzMBA9VU4
    Work        : https://www.youtube.com/tv#/watch?v=oNXzMBA9VU4
  */

  const link = linkArg
    .replace('watch/video/idle?v', 'watch?v')
    .replace('watch/video/seek?v', 'watch?v')
    .replace('watch/video/control?v', 'watch?v')
    .replace('watch/video?v', 'watch?v')
    .replace(/&list=[a-zA-Z0-9-_]+/, '')
    .replace('&resume', '');

  // return new Promise(async(resolve, reject) => {});

  const cwd = untildify(path.join(config.youtubeDownloadsDir || '~/videos/downloads'));
  const cwdTmp = path.join(cwd, '.tmp');
  await fs.ensureDir(cwd);
  await fs.ensureDir(cwdTmp);

  ctx.status = 200;

  // ctx.type = 'text';
  ctx.set('Connection', 'Transfer-Encoding; keep-alive');
  ctx.set('Content-Type', 'text/html; charset=utf-8');
  ctx.set('Transfer-Encoding', 'chunked');
  ctx.set('X-Content-Type-Options', 'nosniff');

  write(code(href(link)));
  write(code('Fetching download URL...'));
  ctx.res.flushHeaders();

  // const video = youtube(link, [], { cwd, maxBuffer: Infinity });
  let videoInfo;
  try {
    videoInfo = await promisify(::youtube.getInfo)(link, [], { cwd, maxBuffer: Infinity });
  } catch (err) {
    write(code(linkify(err.message)));
    write(code(`'youtube-dl --version' = ${await ver}`));
    end();
    throw err;
  }

  if (Array.isArray(videoInfo)) {
    videoInfo = videoInfo[0];
  }

  ctx.info = videoInfo;

  // ctx.log.debug({videoInfo});
  // console.log({ videoInfo });

  let filename = videoInfo._filename;
  if (!filename) {
    write(code('Warning: Couldn\'t get a filename, using url'));
    filename = link
      .replace(/https?\:[\/]+/, '')
      .replace('www.', '')
    // .replace(/\./g, '')
    ;
  }
  filename = sanitizeFilename(filename);
  write(code('Filename: ' + filename));

  const downloadUrl = videoInfo.url;

  if (!downloadUrl) {
    throw new Error('Couldn\'t find a url. Try again or maybe this site isn\'t supported');
  }

  const filepath = path.join(cwd, filename);
  const tempFilepath = path.join(cwdTmp, filename);
  try {
    await fs.access(filepath, fs.constants.F_OK);
    write(code('Error: File already exists'));
    write(textarea(filepath));
    end();
    return;
  } catch (error) {}

  let res;
  let partialSize = 0;
  try {
    await fs.access(tempFilepath, fs.constants.F_OK);
    write(code('Warning Temp File already exists. Trying to resume...'));
    const stat = await fs.stat(tempFilepath);
    partialSize = stat.size;
    try {
      res = await download(downloadUrl, { headers: { range: `bytes=${partialSize}-` } });
      const range = res.headers['content-range'];
      if (!range) {
        throw new Error('Server did not respond with resumable content');
      }
      const match = range.match(/bytes ([0-9]+)-/);
      if (!match) {
        throw new Error(`Invalid {range:${range}}`);
      }
      const matchedRange = parseInt(match[1], 10);
      if (matchedRange !== partialSize) {
        throw new Error(`{matchedRange:${matchedRange}} !== {partialSize:${partialSize}}`);
      }
    } catch (err) {
      partialSize = 0;
      write(code(`Warning Could not resume (${err.message}), removing previous file and trying full download`));
      await fs.remove(tempFilepath);
      res = await download(downloadUrl);
    }
  } catch (error) {
    res = await download(downloadUrl);
  }

  // const filesize = parseInt(res.headers['content-length'], 10);
  // if (!filesize) {
  //   throw new Error('0 filesize, please try again, or maybe the URL isn\'t supported');
  // }
  // write(code('Size: ' + prettyBytes(filesize)));
  // write(code('res.headers:' + JSON.stringify(res.headers)));

  write(code('Writing to file...'));

  if (partialSize) {
    res.pipe(fs.createWriteStream(tempFilepath, { flags: 'r+', start: partialSize }));
  } else {
    res.pipe(fs.createWriteStream(tempFilepath));
  }

  await Promise.race([
    new Promise((resolve) => res.once('end', resolve)),
    new Promise((resolve, reject) => res.once('error', reject))
  ]);

  write(progressScript(`🗸 ${filename}`));
  try {
    await fs.rename(tempFilepath, filepath);
  } catch (err) {
    write(code('Moving out from .tmp dir...'));
    await fs.move(tempFilepath, filepath);
  }
  write(textarea(filepath));

  end();

  /* ************************************************************ */
  /* functions */

  function write(str, br = '\n') {
    ctx.res.write(str + br);
  }

  function end(str) {
    ctx.res.end(str || '');
  }

  function textarea(str) {
    return `<textarea rows=1 cols=${str.length + 10} onClick='this.select()'>${str}</textarea>`;
  }

  function div(str) {
    return '<div>' + str + '</div>';
  }

  function code(str, br = true) {
    let ret = '<code>' + str + '</code>';
    if (br) {
      ret = div(ret);
    }
    return ret;
  }

  function href(url, str) {
    return `<a href='${url}'>${str || url}</a>`;
  }

  function script(code) {
    return `<script>(()=>{${code}})()</script>`;
  }

  function progressScript(str) {
    return div(
      script(`
        const me = document.currentScript
        const parent = me.parentNode
        const previous = parent.previousSibling.previousSibling
        previous.outerHTML = ''
        document.title = '${str}'
      `) + code(str)
    );
  }

  async function download(downloadUrl, opts = {}) {
    write(code('Downloading...'));
    write(code(href(downloadUrl)));
    // write(code(JSON.stringify(opts)));

    let req;
    const res = await new Promise((resolve, reject) => {
      req = request({
        uri: downloadUrl,
        headers: {
          cookie: _.get(videoInfo, 'http_headers.Cookie') || _.get(videoInfo, 'http_headers.cookie'),
          ...opts.headers
        },
      });
      const res = progress(req).on('progress', (state) => {
        let str = '';
        state.percent *= 100;
        str += `${state.percent.toFixed(state.percent > 10 ? 0 : 1)}%`;
        if (state.time && state.time.remaining && state.time.remaining > 1) {
          str += ` | ${ms(state.time.remaining * 1000, {compact: true})}`;
        }
        if (state.size) {
          str += ' | ';
          if (state.size.transferred) {
            str += `${prettyBytes(state.size.transferred).replace(/\.[0-9]+/, '').replace(/\s/g, '')} of `;
          }
          if (state.size.total) {
            str += `${prettyBytes(state.size.total).replace(/\.[0-9]+/, '').replace(/\s/g, '')}`;
          }
        }
        if (state.speed) {
          str += ` | ${prettyBytes(state.speed || 0).replace(/\.[0-9]+/, '').replace(/\s/g, '')}/s`;
        }
        write(progressScript(str));
      });
      resolve(res);
      // req.once('response', resolve);
      // req.once('response', _res => {
      //   _res.res = res;
      //   resolve(_res);
      // });
      req.once('error', err => {
        write(code('Couldn\'t download file ' + linkify(downloadUrl) + ' ' + err.message));
        reject(err);
      });
    });
    return res;
  }
};
