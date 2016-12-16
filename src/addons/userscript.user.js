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
  const proxyUrl = window.location.protocol + '//pocal.com:80/proxy';
  const rules = '--insert-rules--';

  document.addEventListener('mousedown', (event) => {
    const leftClick = event.which === 1;
    const middleClick = event.which === 2;

    console.log({click: {leftClick, middleClick}, which: event.which});

    if (!leftClick && !middleClick) {
      return;
    }

    // event.preventDefault();
    const {target} = event;
    const href = target.getAttribute('data-href-url') || target.href;

    if (!href) {
      return;
    }

    console.log({href});

    let newHref = href;

    rules.forEach((rule) => {
      const source = new RegExp(rule.source);

      newHref = newHref.replace(source, rule.target);
    });
    target.href = newHref;

    if (target.href === '--proxy--') {
      const request = new XMLHttpRequest();

      console.log({proxyUrl});

      // synchronous
      request.open('POST', proxyUrl, false);
      request.send(JSON.stringify({href}));

      console.log({responseText: request.responseText});
      target.href = request.responseText;
    }
  });
  console.log('Pocal userscript loaded');
})();
