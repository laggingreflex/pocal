import Config from 'configucius'
import { help } from '../utils'
import defaults from './defaults'

const config = new Config({
  duplicateArgumentsArray: false,
  options: defaults
})

if (config.help) {
  help.printUsage(1)
}

// if (config._.length >= 1) {
//   config.testFiles = config._;
// }

export default config
