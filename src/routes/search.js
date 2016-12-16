import Router from 'koa-router';
import render from '../views';

const router = new Router();

router.get('/search', (ctx) => {
  const query = ctx.query.q || ctx.query.query;

  if (query) {
    ctx.redirect('http://google.com/search?q=' + query);
  } else {
    ctx.body = render('search.pug');
  }
});

export default router.routes();
