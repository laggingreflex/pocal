import Router from 'koa-router'
import getFirefoxAddon from '.../addons/firefox'

const router = new Router()

router.get('/addon/firefox', async (ctx) => {
  ctx.body = await getFirefoxAddon()
  // ctx.set('Content-Disposition', 'attachment; filename="pocal.xpi"')
  ctx.set('Content-Type', 'application/x-xpinstall')
})

export default router.routes()
