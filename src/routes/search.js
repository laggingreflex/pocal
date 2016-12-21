import Router from 'koa-router';
import render from '../views';
import config from '../config';
import { log, loadPlugins } from '../utils';

const router = new Router();

router.get('/search', async(ctx) => {
  const fullQuery = ctx.query.q || ctx.query.query;

  if (!fullQuery) {
    ctx.body = render('search.pug');

    return;
  }

  for (const rule of config.keywords) {
    if (rule.keyword.startsWith('/')) {
      const substr = rule.keyword.slice(1, -1);
      const regex = new RegExp(substr);
      try {
        const appliedTarget = fullQuery.replace(regex, rule.target);
        if (appliedTarget !== fullQuery) {
          ctx.redirect(appliedTarget);
          return;
        }
      } catch (error) {
        console.log({ error, regex });
      }
    } else if (fullQuery.startsWith(rule.keyword + ' ')) {
      const [, query] = fullQuery.split(rule.keyword).map(s => s.trim());
      if (rule.target.includes('--plugin--')) {
        const [, plugin] = rule.target.match(/--plugin--(.*)/);
        const pluginFn = loadPlugins(plugin);
        let appliedTarget = pluginFn(query, ctx);
        if (appliedTarget.then) {
          appliedTarget = await appliedTarget;
        }
        if (appliedTarget) {
          ctx.redirect(appliedTarget);
        }
        return;
      } else {
        const appliedTarget = rule.target.replace('{searchTerms}', query);
        ctx.redirect(appliedTarget);
        return;
      }
    }
  }

  ctx.redirect('http://google.com/search?q=' + encodeURIComponent(fullQuery));
});

export default router.routes();
