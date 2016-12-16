// ==UserScript==
// @name          pocal
// @namespace     pocal
// @description   pocal
// @author        pocal
// @homepage      https://pocal.com:80/
// @include       *
// @version       0.0.1
// @run-at        document-start
// @grant         none
// @downloadURL   https://pocal.com:80/addons/userscript.user.js
// ==/UserScript==
/* eslint-disable import/unambiguous, filenames/match-regex, promise/prefer-await-to-then, no-console */

(() => {
  const host = 'https://pocal.com:80/proxy';
  const rules = '--insert-rules--';

  document.addEventListener('click', (event) => {
    const leftClick = event.which === 1;
    const middleClick = event.which === 2;

    console.log({click: {leftClick, middleClick}, which: event.which});

    if (!leftClick && !middleClick) {
      return;
    }

    // event.preventDefault();
    const {target} = event;
    const {href} = target;

    if (!href) {
      return;
    }

    console.log({href});

    rules.forEach((rule) => {
      target.href = href.replace(new RegExp(rule.source), rule.target);
      console.log({rule: new RegExp(rule.source), target: target.href});
    });

    if (/* needs server intervention */ false) {
      event.preventDefault();
      const loadUrl = (url = href) => {
        console.log({loadUrl: url});
        if (leftClick) {
          window.location.href = url;
        } else {
          window.open(url);
        }
      };

      const timeout = setTimeout(loadUrl, 1000);

      fetch(host, {
        body: {href},
        method: 'POST'
      }).then((response) => {
        console.log({response});

        return response.text();
      }).then((url) => {
        console.log({text: url});
        clearTimeout(timeout);

        return loadUrl(url);
      }).catch(() => {
        return loadUrl();
      });
    }
  });
  console.log('Pocal userscript loaded');
})();
