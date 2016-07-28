//
// Default rewrites for routes
//
exports.rewrites = require('./rewrites');

//
// Default CouchDB documents to exclude
//
exports.exclude = [
  '_design/ghost',
  '_design/scratch',
  '_design/ui',
  '_design/app',
  'error: forbidden',
];

exports.proxy = {
  //
  // Public npm registry url
  //
  npm: 'https://registry.nodejitsu.com',
  policy: {
    //
    // Private npm registry url
    //
    npm: 'http://localhost:5984'
  }
};

//
// Function to filter excluded documents
//
exports.filter = function(f) {
  return (!(~exports.exclude.indexOf(f)));
};

//
// HTTP Port
//
exports.http = 8044;

//
// HTTPS Options
//
//var path = require('path')
//exports.https = {
//    port: 443
//  , root: path.join(__dirname)
//  , key: 'server.key'
//  , cert: 'server.cert'
//}
