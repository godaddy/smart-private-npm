var common = require('./fixtures/common')
  , request = require('request')
  , url = require('url')
  , http = require('http')
  , server

var Proxy = process.env.SPNPM_COV
  ? require('../lib-cov').Proxy
  : require('../lib').Proxy

// noop log
var log = {
  info: function() {},
  warn: function() {},
  error: function() {}
}

var options = {
  npm: url.parse(common.public.url),
  policy: {
    npm: url.parse(common.private.url),
    private: {
      'priv-basic-ok': 1,
      'priv-wl-ok-get': 1,
      'wl-ok-put': 1,
      'wl-ok-put-priv': 1
    },
    blacklist: {},
    transparent: false,
    whitelist: {
      'pub-wl-ok': 1,
      'wl-ok-put': 1
    }
  },
  log: log
}

var proxy = new Proxy(options)

describe('whitelist', function() {
  before(function(done) {
    server = http
                .createServer(proxy.decide.bind(proxy))
                .listen(common.port, done)
  })

  after(function(done) {
    server.on('close', done)
    server.close()
  })

  describe('private', function() {
    it('should proxy GET /priv-wl-ok-get to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-wl-ok-get',
        json: true
      }
      request.get(opts, common.privateOk(done))

    })

    it('should proxy PUT /wl-ok-put to public registry', function(done) {
      var opts = {
        uri: common.host+'/wl-ok-put',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })

    it('should proxy PUT /wl-ok-put-priv to private registry', function(done) {
      var opts = {
        uri: common.host+'/wl-ok-put-priv',
        json: true
      }
      request.put(opts, common.privateOk(done))
    })

    it('should proxy PUT /priv-basic-notfound to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-basic-notfound',
        json: true
      }
      request.put(opts, common.privateNotFound(done))
    })
  })

  describe('public', function() {
    it('should proxy GET /pub-wl-ok to public registry', function(done) {
      var opts = {
        uri: common.host + '/pub-wl-ok',
        json: true
      }
      request.get(opts, common.publicOk(done))
    })

    it('should error on PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.put(opts, common.error(done))
    })
  })

  describe('notFound', function() {
    it('should return not found', function(done) {
      var opts = {
        uri: common.host+'/pub-not-found',
        json: true
      }
      request.get(opts, common.error(done))
    })
  })
})
