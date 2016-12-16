import Router from 'koa-router';

const router = new Router();

router.post('/proxy', (ctx) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.body = 'http://google.com';
});

export default router.routes();
