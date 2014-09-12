#!/usr/bin/env node
'use strict';

var defaultConfig = require('../config/default'),
    snpm = require('../lib'),
    url = require('url'),
    fs = require('fs'),
    path = require('path')
    util = require('util');

process.title = 'smart-private-npm';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    help: 'h',
    'private': 'P',
    'public': 'p',
    config: 'c',
    exclude: 'e',
    loglevel: 'l',
    transparent: 't',
    'ignore-private': 'i'
  },
  boolean: ['help', 'transparent', 'ignore-private'],
  string: ['private', 'public', 'exclude', 'loglevel'],
  default: {
    loglevel: 'info',
    transparent: false,
    'ignore-private': false
  }
});

if (argv.help) {
  return fs.createReadStream(__dirname + '/usage.txt')
    .pipe(process.stdout)
    .on('close', function () { process.exit(1); });
}

// TODO: Replace with diagnostic
var winston = require('winston');

var config = argv.config ? require(path.resolve(process.cwd(), argv.config)) : {};

var log = config.log = config.log || new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: argv.loglevel, colorize: true })
  ]
});

config.ip = argv.i;

if (typeof config.public === "string") {
  config.public = url.parse(config.public);
}
if (typeof config.private === "string") {
  config.private = url.parse(config.private);
}

var snpmOpts = {
  rewrites: null,
  proxy: {
    npm: null,
    policy: {
      npm: null,
      private: {},
      blacklist: {},
      transparent: false
    },
    log: null
  },
  http: null,
  https: null,
  log: null
};

snpmOpts = util._extend(snpmOpts, defaultConfig, config, argv);
delete snpmOpts.config;

if (argv.config) {
  log.verbose('config => %s', argv.config);
}
log.verbose('private registry => %s', snpmOpts.proxy.policy.npm);
log.verbose('public registry => %s', snpmOpts.npm);
log.verbose('http => %s', ''+snpmOpts.http);
log.verbose('https => '+(snpmOpts.https ? snpmOpts.https : 'null'));
log.verbose('excludes =>', snpmOpts.exclude);
log.verbose('transparent =>', snpmOpts.proxy.transparent);
log.verbose('ignore-private =>', snpmOpts.ip);

if (snpmOpts.ip === true) {
  getPkgs = function(a, cb) {
    process.nextTick(function() {
      cb(null, []);
    });
  };
}

snpm.getPkgs(snpmOpts, function(err, privatePkgs) {
  if (err) {
    if (err.code && err.code === 'ECONNREFUSED') {
      log.error('Error loading private packages', err.message);
      log.error('Is your private registry running and accessible at [%s]?', snpmOpts.proxy.policy.npm);
    } else {
      log.error('Error loading private packages', { err: err });
    }

    return process.exit(1);
  }

  snpmOpts.proxy.policy.private = privatePkgs;
  snpm.createServer(snpmOpts, function(err, servers) {
    if (err) {
      log.error('error starting private npm', { err: err });
      log.error('servers: %j', Object.keys(servers));
      return process.exit(1);
    }
    log.info('private npm running on: %j', Object.keys(servers));
  });
});
