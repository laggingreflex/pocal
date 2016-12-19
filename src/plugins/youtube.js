import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs-promise';
import untildify from 'untildify';
import { promisify, promisifyAll } from 'bluebird';
import prettyBytes from 'pretty-bytes';
import youtube from 'youtube-dl';
import linkify from 'linkifyjs/html';
import config from '../config';

promisifyAll(youtube);

// promisifyAll(http);

const ver = youtube.execAsync('--version', [], {}).then(o => o.join(''));

export default (linkArg, ctx) => {
  // fix youtube/tv
  // https://github.com/rg3/youtube-dl/issues/11485
  // https://github.com/regexhq/youtube-regex/issues/7
  // Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4&resume
  // Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4
  // Doesn't work: https://www.youtube.com/tv#/watch/video/seek?v=oNXzMBA9VU4
  // Doesn't work: https://www.youtube.com/tv#/watch/video/control?v=oNXzMBA9VU4
  // Doesn't work: https://www.youtube.com/tv#/watch/video?v=oNXzMBA9VU4
  // Work        : https://www.youtube.com/tv#/watch?v=oNXzMBA9VU4

  const link = linkArg
    .replace('watch/video/idle?v', 'watch?v')
    .replace('watch/video/seek?v', 'watch?v')
    .replace('watch/video/control?v', 'watch?v')
    .replace('watch/video?v', 'watch?v')
    .replace('&resume', '');

  return new Promise(async(resolve, reject) => {
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

    writeHref(link);
    writeCode('Fetching...');
    ctx.res.flushHeaders();

    // const video = youtube(link, [], { cwd, maxBuffer: Infinity });
    let video;
    try {
      video = await youtube.getInfoAsync(link, [], { cwd, maxBuffer: Infinity });
    } catch (err) {
      writeCode(linkify(err.message));
      writeCode(`'youtube-dl --version' = ${await ver}`);
      end();
      reject(err);
      return;
    }

    const filename = video._filename;
    writeCode('Filename: ' + filename);

    const filepath = path.join(cwd, filename);
    const tempFilepath = path.join(cwdTmp, filename);
    try {
      await fs.access(filepath, fs.constants.F_OK);
      writeCode('Error: File already exists');
      writeFilepath();
      end();
      resolve();
      return;
    } catch (error) {}
    try {
      await fs.access(tempFilepath, fs.constants.F_OK);
      writeCode('Warning Temp File already exists. Removing...');
      await fs.remove(tempFilepath);
    } catch (error) {}

    writeCode('Downloading...');

    // const downloadUrl = video.url.replace()

    let req;
    const method = video.url.includes('https') ? https : http;
    const res = await new Promise((resolve) => {
      req = method.get(video.url, resolve);
    });
    req.on('error', err => {
      writeCode('Couldn\'t download file ' + linkify(video.url) + ' ' + err.message);
      reject(err);
    });

    const filesize = parseInt(res.headers['content-length'], 10);
    writeCode('Size: ' + prettyBytes(filesize));

    writeCode('Writing to file...');

    res.pipe(fs.createWriteStream(tempFilepath));

    let dlSize = 0;
    let percent = 0;
    res.on('data', ({ length }) => {
      dlSize += length;
      if (dlSize > filesize * (percent / 100)) {
        writeCode(`${percent++}%…`, false);
      }
    });

    await promisify(::res.on)('end');

    writeCode('Finished downloading!');
    try {
      try {
        writeCode('Moving out from .tmp dir...');
        await fs.rename(tempFilepath, filepath);
      } catch (err) {
        writeCode('Rename failed, actually moving now...');
        await fs.move(tempFilepath, filepath);
      }
    } catch (err) {
      end(err.message);
      reject(err);
    }
    write(`<textarea rows=1 cols=${filepath.length + 10} onClick='this.select()'>${filepath}</textarea>`);
    end();
    resolve();

    function writeFilepath() {
      write(`<textarea rows=1 cols=${filepath.length + 10} onClick='this.select()'>${filepath}</textarea>`);
    }
  });

  function write(str, br = '\n') {
    ctx.res.write(str + br);
  }

  function end(str) {
    ctx.res.end(str || '');
  }

  function writeDiv(str) {
    write('<div>' + str + '</div>');
  }

  function writeCode(str, br = true) {
    if (br) {
      writeDiv('<code>' + str + '</code>');
    } else {
      write('<code>' + str + '</code>');
    }
  }

  function writeHref(url, str) {
    ctx.res.write(`<a href='${url}'>${str || url}</a>`);
  }
};
