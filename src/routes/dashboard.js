import Router from 'koa-router';
import _ from 'lodash';
import render from '../views';
import config from '../config';

const router = new Router();

router.get('/dashboard', (ctx) => {
  ctx.body = render('dashboard.pug');
});

router.all('/dashboard/client-url-replacer', async(ctx) => {
  config.readConfigFile();

  let rules;

  if (ctx.request.body && Object.entries(ctx.request.body).length) {
    rules = _.map(ctx.request.body, (value) => {
      return value;
    }).filter((rule) => {
      return rule.source && rule.target;
    });
    config.clientUrlReplace = rules;
    await config.save();
  } else {
    rules = config.clientUrlReplace;
  }
  rules = rules || [];
  ctx.body = render('dashboard-client-url-replacer.pug', {rules});
});

router.all('/dashboard/keywords', async(ctx) => {
  config.readConfigFile();

  let rules;

  if (ctx.request.body && Object.entries(ctx.request.body).length) {
    rules = _.map(ctx.request.body, (value) => {
      return value;
    }).filter((rule) => {
      return rule.keyword && rule.target;
    });
    config.keywords = rules;
    await config.save();
  } else {
    rules = config.keywords;
  }
  rules = rules || [];
  ctx.body = render('dashboard-keywords.pug', {rules});
});

export default router.routes();
