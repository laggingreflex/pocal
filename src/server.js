import Koa from 'koa'
import portscanner from 'portscanner'
import { log, koaLogger } from './utils'
import * as routes from './routes'

const app = new Koa()

app.use(koaLogger)

for (const k in routes) {
  const route = routes[k]
  if (typeof route === 'function') {
    app.use(route)
  }
}

export default async function createServer () {
  const port = await portscanner.findAPortNotInUse(3000, 3010)
  console.log('even?')
  return app.listen(port, () => log(`Listening on port ${port}`))
}

async function foo () {
  console.log('even?')
}
