import 'require-up/register'
import 'source-map-support/register'
import config from './config'
import createServer from './server'
import { handleErrors } from './utils'

export default config.prompt({ missing: true, save: true })
  .then(createServer)
  .catch(handleErrors)
