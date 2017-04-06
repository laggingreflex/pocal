# Plugins

(this feature is currently only for keyword search)

A plugin can be enabled for a particular keyword search by going to [`http://localhost:6000/dashboard/keywords`](http://localhost:6000/dashboard/keywords) and in the target column put `'--plugin--<plugin-name>'`.

```
ytd                       --plugin--youtube-dl
```

## Locations

The `<plugin-name>` is looked for in the following locations:

```
./ (in this module dir (pre-loaded plugins))
~/.pocal/
~/.pocal/node_modules
../../node_modules/ (in this module dir)
```

## Architecture

(plugins in [this directory](./) can be used as a template)

The plugin must export a function which is called with the following signature:

```js
export default async(link, ctx) => {
  //...
}
```

* **`link`** The URL (or text after `ytd` keyword)
* **`ctx`** [Koa's `ctx` object][koajs#context]

  The plugin is really just like a [Koa middleware] function giving you access to the `ctx` with which to do whatever you want and respond to the request likewise.

[koajs#context]: http://koajs.com/#context
[Koa middleware]: http://koajs.com/#cascading

