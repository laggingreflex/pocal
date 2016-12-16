// ==UserScript==
// @name          pocal
// @namespace     pocal
// @description   pocal
// @author        pocal
// @homepage      http://pocal.com:80/
// @include       *
// @version       0.0.1
// @run-at        document-start
// @downloadURL   http://pocal.com:80/addons/userscript.user.js
// ==/UserScript==
/* eslint-disable import/unambiguous, filenames/match-regex, promise/prefer-await-to-then, no-console */

(() => {
  const host = 'http://pocal.com:80/proxy';

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

    if (href.match(/youtube.com|youtu.be/)) {
      const match = href.match(/youtube\.com\/watch\?v=([a-zA-Z0-9-_]+)/) || href.match(/youtu\.be\/([a-zA-Z0-9-_]+)/);

      if (match) {
        const [, id] = match;

        target.href = 'https://www.youtube.com/tv#/watch?v=' + id;

        return;
      } else {
        event.preventDefault();
        alert('weird youtube link');

        return;
      }
    }

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
