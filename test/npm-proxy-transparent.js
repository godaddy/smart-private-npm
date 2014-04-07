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
    transparent: true
  },
  log: log
}

var proxy = new Proxy(options)

describe('transparent', function() {
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
    it('should proxy PUT /basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/basic-ok',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })
  })

  describe('public', function() {
    it('should error on PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })
  })

  describe('notFound', function() {
    it('should return not found', function(done) {
      var opts = {
        uri: common.host+'/pub-not-found',
        json: true
      }
      request.get(opts, common.publicNotFound(done))
    })
  })
})
