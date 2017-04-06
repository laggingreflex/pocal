# Installation

## Prerequisites

1. [Node.js](https://nodejs.org) v6 or above.

    <sup>On windows if you get [node-command-not-found] you may need to reboot, logoff, or [restart explorer.exe].</sup>

2. [Greasemonkey] (for Firefox) or [Tampermonkey] (for Chrome).

## Install via npm

Install it as a global package so you may run it from command-line from anywhere:

```
npm install --global pocal
```

# Running

Just run
```
pocal
```
It should output something like
```
Listening on port 6000
```
Open [`http://localhost:6000`](http://localhost:6000) in your browser to view the dashboard.

# Setup

## Addons

To achieve the client-side url-manipulations and keyword searches it will need to install a userscript (via greasemonkey) and custom search plugin.

Goto [`http://localhost:6000/addons`](http://localhost:6000/addons)

### Install the userscript

The userscript is hosted from the server itself which you may find in [`http://localhost:6000/addons/userscript.user.js`](http://localhost:6000/addons/userscript.user.js)

### Install the custom search plugin

The custom search plugin is an [OpenSearch plugin] that redirects search queries to the server. It is also hosted on the server itself which you may find in  [`http://localhost:6000/addons/search-plugin`](http://localhost:6000/addons/search-plugin)

* **Note**: Currently this auto-install for some reason only works in Firefox.

    In **Chrome** goto `⠇ > Settings > Search > Manage search engines` then in the `Other search engines > Add a new search engine` (scroll to the bottom if you have many search engines):


|Name   |Keyword|URL
|-------|-------|---
|`Pocal`|`p`    |`http://localhost:6000/search?q=%s`

The click **Make default** in front of it.

If you don't wish to make it your default search engine you'll have to prefix all your search queries with the chosen keyword (`p`). It automatically searches for google for queries that don't match with any keyword so that covers the main purpose of the default google search plugin anyways.



[restart explorer.exe]: http://google.com/search?q=restart+explorer.exe

[node-command-not-found]: http://google.com/search?q=windows+node+install+node+command+not+found


[Greasemonkey]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey

[Tampermonkey]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en

[generating-an-ssh-key]: https://help.github.com/articles/generating-an-ssh-key

[yarn]: http://yarnpkg.com

[gfork]: https://github.com/laggingreflex/gfork

[OpenSearch plugin]:https://developer.mozilla.org/en/Add-ons/Creating_OpenSearch_plugins_for_Firefox

[Node.js server]: https://nodejs.org/api/synopsis.html

[Greasemonkey userscript]: http://www.greasespot.net

