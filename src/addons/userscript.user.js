// ==UserScript==
// @name          pocal
// @namespace     pocal
// @description   pocal
// @author        pocal
// @homepage      http://pocal.com:80/
// @include       *
// @version       0.0.1
// @run-at        document-start
// @grant         none
// @downloadURL   https://pocal.com:80/addons/userscript.user.js
// ==/UserScript==
/* eslint-disable import/unambiguous, filenames/match-regex, promise/prefer-await-to-then, no-console */

(() => {
  const baseUrl = '//pocal.com:80';
  // const baseUrl = window.location.protocol + '//pocal.com:80';
  const proxyUrl = baseUrl + '/proxy';
  const rulesUrl = baseUrl + '/config/clientUrlReplace';

  let rules = '--insert-rules--';

  const log = (...msg) => console.log('[Pocal]', ...msg);
  log.err = (...msg) => console.error('[Pocal error]', ...msg);

  fetch(rulesUrl).then(res => res.json()).then(data => {
    rules = data;
    log('New rules loaded', rules);
    return rules;
  });

  document.addEventListener('mousedown', main);
  document.addEventListener('mousedown', () => main(), true);
  // log('Userscript loaded');

  let symbol = 'ATTACHED_BY_POCAL';
  if (typeof Symbol !== 'undefined') {
    symbol = Symbol(symbol);
  }

  function main(event) {

    if (!event) {
      log.err('`event` object not found')
      return
    }

    // if (event[symbol]) return;
    // event[symbol] = true;

    const leftClick = event.which === 1;
    const middleClick = event.which === 2;

    // console.log({click: {leftClick, middleClick}, which: event.which});

    if (!leftClick && !middleClick) {
      return;
    }

    // event.preventDefault();
    const { target } = event;
    const href = target.getAttribute('data-href-url') || target.href;

    if (!href) {
      return;
    }

    if (href.includes('#')) {
      return;
    }

    log('Processing link:', { href });

    const oldHref = href;
    let newHref = href;

    rules.forEach((rule) => {
      const source = new RegExp(rule.source);
      const replace = newHref.replace(source, rule.target);
      if (replace !== newHref) {
        newHref = replace;
        log('Replacing link:', { newHref, source, rule });
      } else {
        // log('Unused rule:', { source, rule });
      }
    });

    // log('Final link:', { newHref });

    target.href = newHref;

    if (target.href === '--proxy--sync--') {
      const request = new XMLHttpRequest();

      log({ proxyUrl });

      // synchronous
      request.open('POST', proxyUrl, false);
      request.send(JSON.stringify({ href }));

      log({ responseText: request.responseText });
      target.href = request.responseText;
    }
    if (target.href === '--proxy--async--') {
      event.preventDefault();
      const request = new XMLHttpRequest();

      log({ proxyUrl });

      // asynchronous
      request.open('POST', proxyUrl, true);
      request.send(JSON.stringify({ href }));
    }

    setTimeout(() => {
      target.href = oldHref;
    }, 200)
  }
})();
