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
  npm: [url.parse(common.public.url)],
  policy: {
    npm: url.parse(common.private.url),
    limits: {
      private: 1,
      public: 0
    },
    private: {
      'priv-basic-ok': 1,
      'priv-basic-ok': 1
    },
    blacklist: {},
    transparent: false,
    whitelist: {}
  },
  log: log
}

var proxy = new Proxy(options)

describe('limits', function() {
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
    it('should proxy PUT /priv-basic-ok to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-basic-ok',
        json: true
      }
      request.put(opts, common.privateOk(done))
    })

    // should error because we have more packages in policy.private
    // than our limit allows
    it('should proxy PUT /priv-error to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-error',
        json: true
      }
      request.put(opts, common.error(done))
    })
  })

  describe('public', function() {
    it('should error on PUT /pub-error to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-error',
        json: true
      }
      request.put(opts, common.error(done))
    })

    it('should error on PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.put(opts, common.error(done))
    })
  })
})
