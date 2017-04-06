
# Dashboard

[`http://localhost:6000/dashboard`](http://localhost:6000/dashboard)

Here you have two options:

## Keywords

[`http://localhost:6000/dashboard/keywords`](http://localhost:6000/dashboard/keywords)

If you've installed the custom search-plugin correctly, here is where you can manage what rules are applied.

### `{searchTerms}`
```
r                         http://reddit.com/search?q={searchTerms}
```
`{searchTerms}` will contain whatever you entered after `r`, as in: `r whatever`

### RegExp
```
/r ([\w]+) ([\w]+)/       http://reddit.com/r/$1/search?q=$2
```

* Regex needs to be surrounded by forward slashes

* Positional capture groups are replaced in the target URL as `$1`, `$2`, ...

Rules are processed in order, so the following:
```
r                         http://reddit.com/search?q={searchTerms}
/r ([\w]+) ([\w]+)/       http://reddit.com/r/$1/search?q=$2
```
will **always** match first. To avoid this, place ***more*** **specific** rules ***before*** more **general** rules:
```
/r ([\w]+) ([\w]+)/       http://reddit.com/r/$1/search?q=$2
r                         http://reddit.com/search?q={searchTerms}
```
this will only match the second rule if it doesn't find two capture groups. So "r webdev something" matches first whereas "r something" doesn't and so it matches the second.

The rules I personally use (as of writing this) are (in [config.sample.json](../../config.sample.json)):

```
g                         http://google.com/search?btnI&q={searchTerms}
js                        http://google.com/search?q={searchTerms}+(javascript+OR+nodejs)
/r ([\w]+) ([\w]+)/       http://reddit.com/r/$1/search?restrict_sr=on&sort=comments&t=all&q=$2
r                         http://reddit.com/search?sort=comments&t=all&q={searchTerms}
ru                        http://reddit.com/search?sort=comments&t=all&q=url:{searchTerms}
wa                        http://web.archive.org/web/{searchTerms}
ytd                       --plugin--youtube-dl
```
Most of these should be self-explanatory.

The `g` keyword uses "btnI" google keyword which is the "I'm feeling lucky" feature of google. Handy in case you know the search result will be the first one so you may directly land on that site, for eg. "g wiki recursion"

The `ytd` keyword has the syntax of using a plugin: `--plugin--<plugin-name>` which in this case uses `youtube-dl` plugin that comes with it.

## Client url replacer

[`http://localhost:6000/dashboard/client-url-replacer`](http://localhost:6000/dashboard/client-url-replacer)

To replace a URL that matches a regex using capture groups.

The rules here are automatically converted to a regex, so you don't need to enclose them in forward slash.

The rules I personally use (as of writing this) are:
```
youtube\.com\/watch\?v=([a-zA-Z0-9-_]+)       youtube.com/tv#/watch?v=$1
youtu\.be\/([a-zA-Z0-9-_]+)                   youtube.com/tv#/watch?v=$1
```
It modifies all plain `youtube` links into `youtube/tv#` links which IMO has a much better interface.


# Config

Config is stored in `~/.pocal` (`C:\Users\<you>\.pocal` in Windows) as plain JSON. You can use (copy-paste) [config.sample.json](../../config.sample.json) to import most above mentioned rules.
