var http = require('http')
  , url = require('url')
  , common = require('./common')

exports.start = function(cb) {
  exports.server = http.createServer(handle)
                       .on('error', cb)
                       .listen(common.public2.port, cb)
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
