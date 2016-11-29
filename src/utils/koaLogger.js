import { createLogger } from './log'
const log = createLogger('koa')

export default async function (ctx, next) {
  log.verb(ctx.url)
  await next()
}
