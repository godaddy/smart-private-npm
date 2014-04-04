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
  writePrivateOk: writeOk,
  policy: {
    npm: url.parse(common.private.url),
    private: {},
    blacklist: {},
    transparent: false
  },
  log: log
}

function writeOk(policy, proxy) {
  return new Error('This is an error')
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
  })
})
