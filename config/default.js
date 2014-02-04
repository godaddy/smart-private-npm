var path = require('path')

//
// Default CouchDB documents to exclude
//
exports.exclude = [
    '_design/ghost'
  , '_design/scratch'
  , '_design/ui'
  , '_design/app'
  , 'error: forbidden'
]

//
// Private npm registry url
//
exports.private = 'http://localhost:5984'

//
// Public npm registry url
//
exports.public = 'https://registry.nodejitsu.com'

//
// Function to filter excluded documents
//
exports.filter = function(f) {
  return (!(~exports.exclude.indexOf(f)))
}

//
// HTTP Port
//
exports.http = 8044

//
// HTTPS Options
//
exports.https = {
    port: 443
  , root: path.join(__dirname)
  , key: 'server.key'
  , cert: 'server.cert'
}
