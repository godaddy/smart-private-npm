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
    private: {},
    blacklist: {},
    transparent: false
  },
  log: log
}

var proxy = new Proxy(options)

describe('basic', function() {
  before(function(done) {
    server = http.createServer(function(req, res) {
      switch (common.url(req.url)) {
        case '/priv-basic-ok':
          proxy.private(req, res)
          break
        case '/pub-basic-ok':
          proxy.public(req, res)
          break
      }
    }).listen(common.port, done)
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
      request.get(opts, common.privateOk(done))
    })

    it('should proxy PUT /priv-basic-ok to private registry', function(done) {
      var opts = {
        uri: common.host+'/priv-basic-ok',
        json: true
      }
      request.put(opts, common.privateOk(done))
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

    it('should proxy PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })
  })
})
