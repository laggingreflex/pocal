# Client URL replacer

Specify a rule to replace the clicked URL into something else.

For eg., change `youtube.com/watch` URL into `youtube.com/tv#` URL (for a better full-screen player):

![(demo gif)](gifs/replacer.gif)

# Keyword search

Specify you own keyword searches.

For eg., searching for `"r whatever"` takes you to reddit search results:

![(demo gif)](gifs/search-keywords.gif)

It also supports regex for advanced replace. Enclose regex in forward-slashes: `/xxx/`

For eg., `'/r ([\w]+) ([\w]+)/'` captures two positional groups which you can replace in: `'reddit.com/r/$1/search?q=$2'` to search in a specific subreddit.

Note: Whichever rule is matched first is executed first, so be sure to place more constrictive rules, like this regex rule, before more general rules, like the simple `'r'` rule as shown above.

# Plugins

See [plugins](../src/plugins/)

Extend functionality by making your own plugins to do advanced stuff.

Comes pre-loaded with the following plugins:

* [**youtube-dl**](../src/plugins/youtube-dl/README.md)

  A `youtube-dl` plugin, which uses [youtube-dl] to download ([most][sites]) videos.

  ![(demo gif)](./gifs/ytd.gif)


[youtube-dl]: http://rg3.github.io/youtube-dl
[sites]: http://rg3.github.io/youtube-dl/supportedsites.html