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
  npm: [url.parse(common.public.url),
        url.parse(common.public2.url)],
  interval: 200,
  policy: {
    npm: url.parse(common.private.url),
    private: {},
    blacklist: {},
    transparent: false
  },
  log: log
}

var proxy = new Proxy(options)

describe('multiple public', function() {
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
    it('should proxy PUT /basic-ok to private registry', function(done) {
      var opts = {
        uri: common.host+'/basic-ok',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })
  })

  describe('public', function() {
    it('should proxy PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      request.put(opts, common.publicOk(done))
    })

    // these are kinda gross,
    // but it allows us to test the interval functionality
    it('should proxy PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      setTimeout(function() {
        request.put(opts, common.publicOk(done))
      }, 200)
    })
    it.skip('should proxy PUT /pub-basic-ok to public registry', function(done) {
      var opts = {
        uri: common.host+'/pub-basic-ok',
        json: true
      }
      setTimeout(function() {
        request.put(opts, common.publicOk(done))
      }, 800)
    })
  })
})
