import path from 'path';
import http from 'http';
import fs from 'fs-promise';
import untildify from 'untildify';
import { promisify } from 'bluebird';
import prettyBytes from 'pretty-bytes';
import ytdl from 'youtube-dl';
import linkify from 'linkifyjs/html';
import config from '../config';

const ytdlVer = promisify(ytdl.exec)('--version', [], {}).then(o => o.join(''));

export default (linkArg, ctx) => {
  // fix youtube/tv
  // https://github.com/rg3/youtube-dl/issues/11485
  // https://github.com/regexhq/youtube-regex/issues/7
  // Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4&resume
  // Doesn't work: https://www.youtube.com/tv#/watch/video/idle?v=oNXzMBA9VU4
  // Doesn't work: https://www.youtube.com/tv#/watch/video?v=oNXzMBA9VU4
  // Work        : https://www.youtube.com/tv#/watch?v=oNXzMBA9VU4

  const link = linkArg
    .replace('watch/video/idle?v', 'watch?v')
    .replace('watch/video?v', 'watch?v')
    .replace('&resume', '');

  return new Promise(async(resolve, reject) => {
    const cwd = untildify(path.join(config.youtubeDownloadsDir || '~/videos/downloads'));
    const cwdTmp = path.join(cwd, '.tmp');
    await fs.ensureDir(cwd);
    await fs.ensureDir(cwdTmp);

    ctx.status = 200;

    // ctx.type = 'text';
    ctx.set('Connection', 'Transfer-Encoding');
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.set('Transfer-Encoding', 'chunked');
    ctx.set('X-Content-Type-Options', 'nosniff');

    writeHref(link);
    writeCode('Fetching...');

    let video;
    try {
      video = await promisify(ytdl.getInfo)(link, []);
    } catch (err) {
      writeCode(linkify(err.message));
      writeCode(`'youtube-dl --version' = ${await ytdlVer}`);
      end();
      reject(err);
      return;
    }

    const filename = video._filename;
    writeCode('Filename: ' + filename);
    writeCode('Size: ' + prettyBytes(video.size));
    writeCode('Downloading...');

    const req = promisify(http.get)(video.url);

    req.on('error', err => {
      end(err.message);
      reject(err);
    });

    const res = await req;

    const filepath = path.join(cwd, filename);
    const tempFilepath = path.join(cwdTmp, filename);

    try {
      await fs.access(filepath, fs.constants.F_OK);
      writeCode('Error: File already exists');
      writeFilepath();
      end();
      resolve();
    } catch (error) {
      try {
        await fs.access(tempFilepath, fs.constants.F_OK);
        writeCode('Warning Temp File already exists. Removing...');
        await fs.remove(tempFilepath);
      } catch (error) {}
      writeCode('Writing to file...');
      res.pipe(fs.createWriteStream(tempFilepath));
    }

    // video.on('info', async(info) => {
    //   filename = info._filename;
    //   writeCode('Filename: ' + filename);
    //   writeCode('Size: ' + prettyBytes(info.size));
    //   writeCode('Downloading...');
    //   ctx.res.flushHeaders();
    //   filepath = path.join(cwd, filename);
    //   tempFilepath = path.join(cwdTmp, filename);
    //   try {
    //     await fs.access(filepath, fs.constants.F_OK);
    //     writeCode('Error: File already exists');
    //     writeFilepath();
    //     end();
    //     resolve();
    //   } catch (error) {
    //     try {
    //       await fs.access(tempFilepath, fs.constants.F_OK);
    //       writeCode('Warning Temp File already exists. Removing...');
    //       await fs.remove(tempFilepath);
    //     } catch (error) {}
    //     writeCode('Writing to file...');
    //     video.pipe(fs.createWriteStream(tempFilepath));
    //   }
    // });

    res.on('end', async () => {
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
    });

    // video.on('complete', (info) => {
    //   writeCode('Filename: ' + info._filename + ' already downloaded.');
    //   ctx.res.end('');
    //   resolve();
    // });

    // video.on('end', async() => {
    //   writeCode('Finished downloading!');
    //   try {
    //     try {
    //       writeCode('Moving out from .tmp dir...');
    //       await fs.rename(tempFilepath, filepath);
    //     } catch (err) {
    //       writeCode('Rename failed, actually moving now...');
    //       await fs.move(tempFilepath, filepath);
    //     }
    //   } catch (err) {
    //     end(err.message);
    //     reject(err);
    //   }
    //   write(`<textarea rows=1 cols=${filepath.length + 10} onClick='this.select()'>${filepath}</textarea>`);
    //   end();
    //   resolve();
    // });

    // video.on('error', async(error) => {
    //   // writeCode(error.message.replace('https://yt-dl.org/bug', '</code><a href=\'https://yt-dl.org/bug\'><code>https://yt-dl.org/bug</code></a><code>'));
    //   writeCode(linkify(error.message));
    //   writeCode(`'youtube-dl --version' = ${await ytdlVer}`);
    //   // write(errorMessage);
    //   end();
    //   reject();
    // });

    function writeFilepath() {
      write(`<textarea rows=1 cols=${filepath.length + 10} onClick='this.select()'>${filepath}</textarea>`);
    }
  });

  function write(str) {
    ctx.res.write(str + '\n');
    ctx.res.flushHeaders();
  }

  function end(str) {
    ctx.res.end(str || '');
  }

  function writeDiv(str) {
    write('<div>' + str + '</div>');
  }

  function writeCode(str) {
    writeDiv('<code>' + str + '</code>');
  }

  function writeHref(url, str) {
    write(`<a href='${url}'>${str || url}</a>`);
  }
};
