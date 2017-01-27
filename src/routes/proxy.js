import Router from 'koa-router';

const router = new Router();

router.post('/proxy', (ctx) => {
  ctx.set('Access-Control-Allow-Origin', '*');

  const body = JSON.parse(ctx.request.body);
  // const {href} = body;

  // console.log({body: ctx.request.body});
  ctx.body = 'http://google.com';
});

export default router.routes();
