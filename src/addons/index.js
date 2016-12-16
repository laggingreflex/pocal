import path from 'path';
import fs from 'fs-promise';
import config from '../config';
import {getListeningHost} from '../server';

export default async(filename) => {
  const file = await fs.readFile(path.join(__dirname, filename), 'utf8');

  return file.replace(new RegExp('pocal.com:80', 'gi'), config.host || getListeningHost());
};
