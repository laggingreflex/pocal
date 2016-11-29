import path from 'path'
import fs from 'fs-promise'
import utils from 'jpm/lib/utils'
import xpi from 'jpm/lib/xpi'
import config from '.../config'

export default async function getFirefoxAddon () {
  return (await readXpi()) || readXpi(await createXpi())
}

export async function getApiKeys () {

}

export async function readXpi (xpiPath = path.join(__dirname, 'addon/pocal.xpi')) {
  try {
    await fs.access(xpiPath, fs.constants.R_OK)
    return fs.ReadStream(xpiPath)
  } catch (err) {}
}

export async function createXpi () {
  const opts = {
    addonDir: path.join(__dirname, 'addon'),
    verbose: true
  }
  return utils.getManifest(opts)
    .catch(err => throwErr(`Couldn't get manifest`, err))
    .then(manifest => xpi(manifest, opts))
    .catch(err => throwErr(`Couldn't create xpi`, err))
}

function throwErr (msg, err) {
  err.message = msg + ': ' + err.message
  throw err
}
