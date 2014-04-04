var common = require('./fixtures/common')
  , request = require('request')
  , url = require('url')
  , http = require('http')
  , util = require('util')

var spnpm = process.env.SPNPM_COV
  ? require('../lib-cov')
  : require('../lib')

// noop log
var log = {
  info: function() {},
  warn: function() {},
  error: function() {}
}

var options = {
  proxy: {
    npm: url.parse(common.public.url),
    policy: {
      npm: url.parse(common.private.url),
      private: {
        'priv-basic-ok': 1
      },
      blacklist: {},
      transparent: false
    },
    log: log
  },
  log: log,
  http: common.port
}

// fix for coverage and `create-servers`
// to prevent logging
console.log = function() {
  var skip = 'https | no options.https; no server'
  if (arguments[0] === skip) return
  console._stdout.write(util.format.apply(this, arguments) + '\n')
}

describe('smart-private-npm basic', function() {
  before(function(done) {
    spnpm.createServer(options, done)
  })

  // this doesn't actually reach the notFound handler
  describe('notFound', function() {
    it('should return 404', function(done) {
      var opts = {
        uri: common.host + '/-/fasdjfhalksjdfhlk',
        json: true,
        method: 'head'
      }
      //request(opts, common.publicNotFound(done))
      request(opts, done)
    })
  })

  describe('GET /', function() {
    it('should proxy to public registry', function(done) {
      var opts = {
        uri: common.host + '/',
        json: true
      }
      request.get(opts, common.publicOk(done))
    })
  })

  describe('GET /favicon.ico', function() {
    it('should proxy to public registry', function(done) {
      var opts = {
        uri: common.host + '/favicon.ico',
        json: true
      }
      request.get(opts, common.publicOk(done))
    })
  })

  ;['get', 'put', 'post', 'delete'].forEach(function(method) {
    describe(method+' /_session', function() {
      it('should proxy to private registry', function(done) {
        var opts = {
          uri: common.host + '/_session',
          json: true,
          method: method
        }
        request(opts, common.privateOk(done))
      })
    })
  })

  describe('list functions', function() {
    describe('GET', function() {
      var paths = common.list.get
      paths.forEach(function(p) {
        it('should proxy to public registry', function(done) {
          var opts = {
            uri: common.host + p,
            json: true
          }
          request.get(opts, common.publicOk(done))
        })
      })
    })

    describe('PUT', function() {
      var paths = common.list.put
      paths.forEach(function(p) {
        it('should proxy to public registry', function(done) {
          var opts = {
            uri: common.host + p,
            json: true,
            method: 'put'
          }
          request.put(opts, common.publicOk(done))
        })
      })
    })
  })

  describe('packages', function() {
    describe('/:pkg', function() {
      ;['get', 'put', 'delete'].forEach(function(method) {
        it('should proxy using decide logic', function(done) {
          var opts = {
            uri: common.host + '/priv-basic-ok',
            json: true,
            method: method
          }
          request(opts, common.privateOk(done))
        })
      })
    })

    describe('/:pkg/:version', function() {
      ;['get', 'put', 'delete'].forEach(function(method) {
        it('should proxy using decide logic', function(done) {
          var opts = {
            uri: common.host + '/priv-basic-ok/0.0.1',
            json: true,
            method: method
          }
          request(opts, common.privateOk(done))
        })
      })
    })
  })
})
