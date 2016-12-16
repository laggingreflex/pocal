import Router from 'koa-router';
import _ from 'lodash';
import getAddon from '../addons';
import render from '../views';

const router = new Router();

router.get('/addons', (ctx) => {
  ctx.body = render('addons.pug');
});

router.get('/addons/userscript.user.js', async(ctx) => {
  ctx.body = await getAddon('userscript.user.js');
  ctx.type = 'text';
});

router.get('/addons/search-plugin.xml/:add?', async(ctx) => {
  if (!_.isUndefined(ctx.params.add) || !_.isUndefined(ctx.query.add)) {
    ctx.body = render('search-plugin.pug');
  } else {
    ctx.body = await getAddon('search-plugin.xml');
    ctx.type = 'application/opensearchdescription+xml';
  }
});

export default router.routes();
