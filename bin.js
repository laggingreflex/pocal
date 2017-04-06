#!/usr/bin/env node

require('update-notifier')({ pkg: require('./package.json') }).notify({ defer: false });

require('./dist');
