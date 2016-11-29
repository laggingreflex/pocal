import log from './log'

export default function handleErrors (err) {
  log.err(err)
  process.exit(err.exitcode || 1)
}

process.on('unhandledRejection', handleErrors)
process.on('uncaughtException', handleErrors)
