var util = require('util')

var privateRegistry = {}
  , publicRegistry = {}
  , publicRegistry2 = {}


privateRegistry.port = 8022
privateRegistry.host = 'http://localhost'
privateRegistry.url = [privateRegistry.host, privateRegistry.port].join(':')

publicRegistry.port = 8023
publicRegistry.host = 'http://localhost'
publicRegistry.url = [publicRegistry.host, publicRegistry.port].join(':')

publicRegistry2.port = 8024
publicRegistry2.host = 'http://localhost'
publicRegistry2.url = [publicRegistry2.host, publicRegistry2.port].join(':')

exports.private = privateRegistry
exports.public = publicRegistry
exports.public2 = publicRegistry2
exports.port = 8021
exports.host = 'http://localhost:'+exports.port

exports.portSSL = 8020

exports.json = function(res, code, body) {
  res.writeHead(code, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(body))
}

exports.wrongStatusCode = function(rec, exp, done) {
  var msg = util.format('Status Code: %d, but should have been %d',
    rec, exp)
  return done(new Error(msg))
}

exports.invalidRes = function(rec, done) {
  var msg = util.format('Invalid response received: %j', rec)
  return done(new Error(msg))
}

exports.url = function(url) {
  return url.replace(/\/\//g, '/')
}

exports.publicOk = function(done) {
  return function(err, res, body) {
    if (err) return done(err)
    if (res.statusCode !== 200) {
      return exports.wrongStatusCode(res.statusCode, 200, done)
    }
    if (!body.server) {
      return exports.invalidRes(res, done)
    }
    if (body.server !== 'public') {
      var msg = 'Request should have been proxied to the public registry'
      return done(new Error(msg))
    }
    done()
  }
}

exports.privateOk = function(done) {
  return function(err, res, body) {
    if (err) return done(err)
    if (res.statusCode !== 200) {
      return exports.wrongStatusCode(res.statusCode, 200, done)
    }
    if (!body.server) {
      return exports.invalidRes(res, done)
    }
    if (body.server !== 'private') {
      var msg = 'Request should have been proxied to the private registry'
      return done(new Error(msg))
    }
    done()
  }
}

exports.publicNotFound = function(done) {
  return function(err, res, body) {
    if (err) return done(err)
    if (res.statusCode !== 404) {
      return exports.wrongStatusCode(res.statusCode, 404, done)
    }
    if (!body.server) {
      return exports.invalidRes(res, done)
    }
    if (body.server !== 'public') {
      var msg = 'Request should have been proxied to the public registry'
      return done(new Error(msg))
    }
    done()
  }
}

exports.privateNotFound = function(done) {
  return function(err, res, body) {
    if (err) return done(err)
    if (res.statusCode !== 404) {
      return exports.wrongStatusCode(res.statusCode, 404, done)
    }
    if (!body.server) {
      return exports.invalidRes(res, done)
    }
    if (body.server !== 'private') {
      var msg = 'Request should have been proxied to the private registry'
      return done(new Error(msg))
    }
    done()
  }
}

exports.error = function(done) {
  return function(err, res, body) {
    if (err) return done(err)
    if (res.statusCode !== 400) {
      return exports.wrongStatusCode(res.statusCode, 400, done)
    }
    done()
  }
}

exports.list = {
  get: [
      '/-/jsonp/jsonp_blah'
    , '/-/all/since'
    , '/-/rss'
    , '/-/rss/package_blah'
    , '/-/all'
    , '/-/all/-/jsonp/jsonp_blah'
    , '/-/short'
    , '/-/scripts'
    , '/-/by-field'
    , '/-/fields'
    , '/-/needbuild'
    , '/-/prebuilt'
    , '/-/nonlocal'
    , '/-/_view/all'
    , '/-/_list/all'
    , '/-/_show/all'
  ],
  users: [
      '/-/by-user/user_blah'
    , '/-/starred-by-user/user_blah'
    , '/-/starred-by-package/user_blah'
    , '/-/users'
    , '/-/user/user_blah'
    , '/_users/user_blah'
    , '/-/user-by-email/user_blah'
  ],
  put: [
      '/-/user/user_blah'
    , '/_users/user_blah'
    , '/public_users/user_blah'
  ]
}
