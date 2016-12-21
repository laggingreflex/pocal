import path from 'path';
import untildify from 'untildify';
import arrify from 'arrify';

const pluginCache = {};

/* eslint-disable global-require, import/no-dynamic-require */

export default (plugins) => {
  if (Array.isArray(plugins)) {
    for (const plugin of arrify(plugins)) {
      pluginCache[plugin] = pluginCache[plugin] || requireModule(plugin);
      if (pluginCache[plugin].default) {
        pluginCache[plugin] = pluginCache[plugin].default;
      }
    }
    return pluginCache;
  } else {
    const plugin = plugins;
    pluginCache[plugin] = pluginCache[plugin] || requireModule(plugin);
    if (pluginCache[plugin].default) {
      pluginCache[plugin] = pluginCache[plugin].default;
    }
    return pluginCache[plugin];
  }
};

function requireModule(request) {
  const list = [
    path.join(__dirname, '../plugins', request),
    untildify(path.join('~/.pocal', request)),
    untildify(path.join('~/.pocal/node_modules', request)),
    request,
  ];
  const found = requireOneFromList(list);
  if (found) {
    return found;
  } else {
    return require(`${request}' in either '../plugins/' or '~/pocal/`);
  }
}

function requireOneFromList(list, opts) {
  for (const item of list) {
    const found = requireSingle(item, opts);
    if (found) {
      return found;
    }
  }
  return false;
}

function requireSingle(module, { silent = 'critical' } = {}) {
  try {
    return require(module);
  } catch (err) {
    if (err.message !== `Cannot find module '${module}'`) {
      if (!silent || silent === 'critical') {
        throw err;
      }
    }
    if (silent) {
      return false;
    } else {
      throw err;
    }
  }
}
