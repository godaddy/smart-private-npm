#!/usr/bin/env node
'use strict';

var defaultConfig = require('../config/default'),
    snpm = require('../lib'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    getPkgs = require('npm-registry-packages');

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

var log = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: argv.loglevel, colorize: true })
  ]
});

var config = argv.config ? require(path.resolve(process.cwd(), argv.config)) : {};

config.ip = argv.i;

//
// TODO: A better way of merging the defaults with the cli flags
// taking precendence
//
config.private = argv.private || config.private || defaultConfig.private;

config.public = argv.public || config.public || defaultConfig.public;

config.http = config.http || defaultConfig.http;

config.https = config.https || null;

config.exclude = argv.exclude || config.exclude || defaultConfig.exclude;

config.rewrites = config.rewrites || require('../config/rewrites');

config.transparent = argv.transparent || config.transparent || false;


if (argv.config) {
  log.verbose('config => %s', argv.config);
}
log.verbose('private registry => %s', config.private);
log.verbose('public registry => %s', config.public);
log.verbose('http => %s', ''+config.http);
log.verbose('https => '+(config.https ? config.https : 'null'));
log.verbose('excludes =>', config.exclude);
log.verbose('transparent =>', config.transparent);
log.verbose('ignore-private =>', config.ip);


if (typeof config.public === "string") {
  config.public = url.parse(config.public);
}
if (typeof config.private === "string") {
  config.private = url.parse(config.private);
}

var proxyOpts = {
  rewrites: config.rewrites,
  proxy: {
    npm: config.public,
    policy: {
      npm: config.private,
      private: {},
      blacklist: {},
      transparent: config.transparent
    },
    log: log
  },
  http: config.http,
  https: config.https,
  log: log
};

if (config.blacklist) {
  proxyOpts.proxy.policy.blacklist = config.blacklist;
}

if (config.whitelist) {
  proxyOpts.proxy.policy.whitelist = config.whitelist;
}

if (config.ip === true) {
  getPkgs = function(a, cb) {
    process.nextTick(function() {
      cb(null, []);
    });
  };
}

getPkgs(config.private.href, function(err, pkgs) {
  if (err) {
    if (err.code && err.code === 'ECONNREFUSED') {
      log.error('Error loading private packages', err.message);
      log.error('Is your private registry running and accessible at [%s]?', config.private);
    } else {
      log.error('Error loading private packages', { err: err });
    }

    return process.exit(1);
  }

  if (!config.filter) {
    pkgs = pkgs.filter(function(f) {
      return (!(~config.exclude.indexOf(f)));
    });
  }

  var privatePkgs = {},
      len = pkgs.length;

  if (!config.ip) {
    for (var i=0; i<len; i++) {
      var pkg = pkgs[i];
      privatePkgs[pkg] = 1;
    }

    config.exclude.forEach(function(e) {
      log.verbose('excluding package: '+e);
      if (privatePkgs.hasOwnProperty(e)) {
        delete privatePkgs[e];
      }
    });

    log.verbose('loaded private packages', privatePkgs);
  } else {
    log.verbose('ignoring packages from private registry');
  }

  proxyOpts.proxy.policy.private = privatePkgs;
  snpm.createServer(proxyOpts, function(err, servers) {
    if (err) {
      log.error('error starting private npm', { err: err });
      log.error('servers: %j', Object.keys(servers));
      return process.exit(1);
    }
    log.info('private npm running on: %j', Object.keys(servers));
  });
});
