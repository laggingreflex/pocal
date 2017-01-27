import Router from 'koa-router';
import config from '../config';

const router = new Router();

router.get('/config/:query', (ctx) => {
  const query = ctx.query.q || ctx.query.query || ctx.params.query;
  ctx.body = config[query];
});

export default router.routes();
