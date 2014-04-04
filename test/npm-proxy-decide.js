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
      'priv-invalid': 1
    },
    blacklist: {},
    transparent: false
  },
  log: log
}

var proxy = new Proxy(options)

describe('decide', function() {
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
    it('should proxy GET /priv-basic-ok to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-basic-ok',
        json: true
      }
      request.put(opts, common.privateOk(done))
    })

    it('should error on PUT /priv-invalid to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-invalid',
        json: true
      }
      request.put(opts, common.privateNotFound(done))
    })
  })

  describe('public', function() {
    it('should proxy GET /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.get(opts, common.publicOk(done))
    })
    it('should error on PUT /pub-invalid to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-invalid',
        json: true
      }
      // why is this private? because if it does not exist in either
      // public or private on a PUT/POST, it proxies to private
      request.put(opts, common.privateNotFound(done))
    })
  })
})
