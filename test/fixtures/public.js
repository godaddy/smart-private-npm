var http = require('http')
  , url = require('url')
  , common = require('./common')

exports.start = function(cb) {
  exports.server = http.createServer(handle)
                       .on('error', cb)
                       .listen(common.public.port, cb)
}

exports.stop = function(cb) {
  exports.server.on('close', cb)
  exports.server.close()
}

function handle(req, res) {
  var u = common.url(req.url)
  switch (u) {
    case '/pub-basic-ok':
    case '/basic-ok':
    case '/pub-wl-ok':
    case '/wl-ok-put':
    case '/':
    case '/favicon.ico':
    case '/-/jsonp/jsonp_blah':
    case '/-/all/since':
    case '/-/rss':
    case '/-/rss/package_blah':
    case '/-/all':
    case '/-/all/-/jsonp/jsonp_blah':
    case '/-/short':
    case '/-/scripts':
    case '/-/by-field':
    case '/-/fields':
    case '/-/needbuild':
    case '/-/prebuilt':
    case '/-/nonlocal':
    case '/-/by-user/user_blah':
    case '/-/starred-by-user/user_blah':
    case '/-/starred-by-package/user_blah':
    case '/-/_view/all':
    case '/-/_list/all':
    case '/-/_show/all':
    case '/-/users':
    case '/-/user/user_blah':
    case '/_users/user_blah':
    case '/-/user-by-email/user_blah':
    case '/-/user/user_blah':
    case '/_users/user_blah':
    case '/public_users/user_blah':
      pkgOk(req, res)
      break
    case '/pub-error':
      pkgError(req, res)
      break
    case '/pub-basic-notfound':
    default:
      pkgNotFound(req, res)
      break
  }
}

function pkgOk(req, res) {
  common.json(res, 200, {
    server: 'public'
  })
}

function pkgNotFound(req, res) {
  common.json(res, 404, {
    server: 'public',
    message: 'not_found'
  })
}

function pkgError(req, res) {
  common.json(res, 400, {
    server: 'public'
  })
}
