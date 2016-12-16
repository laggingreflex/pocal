import Router from 'koa-router';
import render from '../views';
import config from '../config';

const router = new Router();

router.get('/search', (ctx) => {
  const query = ctx.query.q || ctx.query.query;

  if (!query) {
    ctx.body = render('search.pug');

    return;
  }

  const [searchKeyword, ...searchTerms] = query.split(/[\s]+/);

  for (const rule of config.keywords) {
    if (rule.keyword === searchKeyword) {
      if (rule.target === '--proxy--') {

      }

      const appliedTarget = rule.target.replace('{searchTerms}', searchTerms);

      ctx.redirect(appliedTarget);

      return;
    }
  }

  ctx.redirect('http://google.com/search?q=' + query);
});

export default router.routes();
