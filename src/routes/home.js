import Router from 'koa-router';
import render from '../views';

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = render('home.pug');
});

export default router.routes();
