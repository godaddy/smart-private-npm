#!/usr/bin/env node

var defaultConfig = require('../config/default')
  , snpm = require('../lib')
  , url = require('url')
  , path = require('path')
  , couch = require('couchpkgs')

process.title = 'smart-private-npm'

var optimist = require('optimist')
  .usage('smart-private-npm [options]')
  .options({
    h: {
      description: 'show help and usage',
      alias: 'help',
      boolean: true
    },
    P: {
      description: 'set the private registry url',
      alias: 'private',
      string: true
    },
    p: {
      description: 'set the public registry url',
      alias: 'public',
      string: true
    },
    c: {
      description: 'set the path to your config file',
      alias: 'config',
      string: true
    },
    e: {
      description: 'exclude pkg from being private',
      alias: 'exclude',
      string: true
    },
    l: {
      description: 'set the log level [verbose, info, quiet]',
      string: true,
      alias: 'loglevel',
      default: 'info'
    },
    t: {
      description: 'enable transparent mode',
      boolean: true,
      alias: 'transparent',
      default: false
    },
    i: {
      description: 'ignore packages from private registry',
      alias: 'ignore-private',
      boolean: true,
      default: false
    }
  })

var argv = optimist.argv
var winston = require('winston')

var log = new winston.Logger({
  transports: [
    new (winston.transports.Console)({ level: argv.loglevel, colorize: true })
  ]
})

if (argv.help) {
  return optimist.showHelp()
}

var config = argv.config
            ? require(argv.config)
            : {}

config.ip = argv.i

//
// TODO: A better way of merging the defaults with the cli flags
// taking precendence
//
config.private = argv.private ||
                config.private ||
                defaultConfig.private

config.public = argv.public ||
                config.public ||
                defaultConfig.public

config.http = config.http || defaultConfig.http

config.https = config.https || null

config.exclude = argv.exclude ||
                config.exclude ||
                defaultConfig.exclude

config.rewrites = config.rewrites ||
                  require('../config/rewrites')

config.transparent = argv.transparent ||
                    config.transparent ||
                    false

if (!config.filter) {
  config.filter = function(f) {
    return (!(~config.exclude.indexOf(f)))
  }
}

if (argv.config) {
  log.verbose('config => %s', argv.config)
}
log.verbose('private registry => %s', config.private)
log.verbose('public registry => %s', config.public)
log.verbose('http => %s', ''+config.http)
log.verbose('https => '+(config.https ? config.https : 'null'))
log.verbose('excludes =>', config.exclude)
log.verbose('transparent =>', config.transparent)
log.verbose('ignore-private =>', config.ip)

var proxyOpts = {
  rewrites: config.rewrites,
  proxy: {
    npm: url.parse(config.public),
    policy: {
      npm: url.parse(config.private),
      private: {},
      blacklist: {},
      transparent: config.transparent
    },
    log: log.verbose
  },
  http: config.http,
  https: config.https,
  log: log.verbose
}

if (config.blacklist) {
  proxyOpts.proxy.policy.blacklist = config.blacklist
}

if (config.whitelist) {
  proxyOpts.proxy.policy.whitelist = config.whitelist
}

var getPkgs = config.ip === false
              ? couch.getPkgs
              : function(a, cb) {
                return cb(null, [])
              }

getPkgs({
  registry: config.private,
  filter: config.filter
}, function(err, pkgs) {
  if (err) {
    if (err.code && err.code === 'ECONNREFUSED') {
      log.error('Error loading private packages', err.message)
      log.error('Is your private registry running and accessible at [%j]?', config.private)
    } else {
      log.error('Error loading private packages', { err: err })
    }

    return process.exit(1)
  }
  var private = {}
    , len = pkgs.length

  if (!config.ip) {
    for (var i=0; i<len; i++) {
      var pkg = pkgs[i]
      private[pkgs] = 1
    }

    config.exclude.forEach(function(e) {
      log.verbose('excluding package: '+e)
      if (private.hasOwnProperty(e)) {
        delete private[e]
      }
    })

    log.verbose('loaded private packages', private)
  } else {
    log.verbose('ignoring packages from private registry')
  }

  proxyOpts.proxy.policy.private = private
  snpm.createServer(proxyOpts, function(err, servers) {
    if (err) {
      log.error('error starting private npm', { err: err })
      log.error('servers: %j', Object.keys(servers))
      return process.exit(1)
    }
    log.info('private npm running on', Object.keys(servers))
  })
})
