# Installation

## Prerequisites

1. Install [Node.js](https://nodejs.org) v6 or above.

    <sup>On windows if you get [node-command-not-found] you may need to reboot, logoff, or [restart explorer.exe].</sup>

2. Install [git](https://git-scm.com)

3. Install [Greasemonkey] extension for firefox or [Tampermonkey] for chrome.


## Method 1: Clone this repo

```
git clone git@github.com:laggingreflex/pocal.git
```
If you're getting "Permission denied (publickey)" error, you probably need set up an [SSH key with Github][generating-an-ssh-key]. Or try https url:
```
git clone https://github.com/laggingreflex/pocal.git
```

Then install its dependencies with npm (or [yarn]\(faster))

```
cd pocal
npm install
```

You may also want to run `npm link` so that you could run it via command line from anywhere

```
npm link
```

<sub>PS: (self-plug) vaguely related but checkout [gfork]</sub>

## Method 2: Install via npm

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

**Note**: For some reason this auto-install currently only works in Firefox. But you may add it manually in **Chrome**: goto `Settings > Search engines`  and add the following:


|Name   |Keyword|URL
|-------|-------|---
|`Pocal`|`p`    |`http://localhost:6000/search?q=%s` **[Make default]**

You may wanna make it the default search engine otherwise you'll have to prepend all your keywords with the chosen keyword. It automatically searches for google for queries that don't match with any keyword so that covers the main purpose of the default google search plugin anyways.





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

