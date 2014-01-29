/*
 * index.js: Top-level include for the smart-private-npm for serving all CouchDB traffic.
 *
 * (C) 2013, Nodejitsu Inc.
 *
 */

var createServers = require('create-servers'),
    director = require('director');

var patterns = {
  packageAnd:  /\/([_\.\(\)!\\ %@&a-zA-Z0-9-]+)\/.*/,
  packageOnly: /\/([_\.\(\)!\\ %@&a-zA-Z0-9-]+)/,
  wildcard:    /\*$/
};

//
// Export the NpmProxy.
//
exports.Proxy = require('./npm-proxy');

//
// ### function createServer (options, callback)
// #### @options {Object} Options for creating the proxy server.
// ####   - http     {Object|number} HTTP options.
// ####   - https    {Object}        HTTPS options.
// ####   - log      {function}      Logging function to use.
// ####   - proxy    {NpmProxy}      Options for the npm Proxy itself.
// ####   - rewrites {Array}         **Optional** All known rewrites to the npm registry.
//
exports.createServer = function (options, callback) {
  var router = exports.createRouter({
    rewrites: options.rewrites,
    proxy:    new exports.Proxy(options.proxy),
    log:      options.log
  });

  createServers({
    http:  options.http,
    https: options.https,
    handler: router.dispatch.bind(router)
  }, callback);
};

//
// ### function routes (options, callback)
// #### @options {Object} Options for starting the proxy
// ####   - log      {function} Logging function to use.
// ####   - rewrites {Array}    All known rewrites to the npm registry.
// ####   - proxy    {NpmProxy} Proxy for npm requests.
//
exports.createRouter = function createRouter(options, callback) {
  var router = new director.http.Router(),
      log    = options.log || console,
      proxy  = options.proxy,
      rewrites,
      server;

  //
  // Get a default set of rewrites if we weren't provided
  // with a custom set.
  //
  options.rewrites = options.rewrites || require('../config/rewrites');

  //
  // Configure director to always use async HTTP
  // stream based routing with a custom 404 handler.
  //
  router.configure({
    async: true,
    stream: true,
    notfound: function () {
      //
      // Pass along the not found notification to the proxy.
      //
      proxy.notFound(this.req, this.res);
    }
  });

  //
  // Remark: we will probably asynchronously load these things in some manner
  // but for now we just expect them
  //
  rewrites = {
    list: options.rewrites.filter(function (rr) {
      return /^_list/.test(rr.to)
        || /^\/-\/_view/.test(rr.from)
        || /^\/-\/_show/.test(rr.from);
    }),
    user: options.rewrites.filter(function (rr) {
      return /_users/.test(rr.to);
    })
  };

  //
  // `/`, `favicon.ico` and `_session` are special cases.
  // TODO: Add route for _utils to make futon hiding more seamless.
  //
  router.get('/',           function () { proxy.public(this.req, this.res);  });
  router.get('favicon.ico', function () { proxy.public(this.req, this.res); });
  ['GET', 'PUT', 'POST', 'DELETE']
    .forEach(function (method) {
      router[method.toLowerCase()]('_session', function () {
        proxy.private(this.req, this.res);
      });
    });

  //
  // All _list/* functions require a merger between
  // public and private npm database views.
  //
  rewrites.list.forEach(function (rr) {
    var wc     = patterns.wildcard,
        method = rr.method.toLowerCase(),
        from   = wc.test(rr.from)
          ? new RegExp(rr.from.replace(wc, '.*'))
          : rr.from;

    log.info('[route]', '%s - %s %s', 'public', method, rr.from);
    router[method](from, function () {
      proxy.public(this.req, this.res);
    });
  });

  //
  // Your private npm must manually sync whatever passwords you want
  // since the public npm _user database is the authority for all that
  // is Open Source.
  //
  // Optimizing for ONE PASSWORD EVERYWHERE, ONE .npmrc EVERYWHERE.
  //
  rewrites.user.forEach(function (rr) {
    var method = rr.method.toLowerCase(),
        from   = rr.from;

    log.info('[route]', '%s - %s %s', 'public', method, from);
    router[method](from, function () {
      proxy.public(this.req, this.res);
    });
  });

  //
  // For core `/:pkg` and `/:pkg/*` routes use the more complex, higher-level
  // proxy logic.
  //
  [patterns.packageOnly, patterns.packageAnd].forEach(function (re) {
    ['GET', 'PUT', 'DELETE'].forEach(function (method) {
      method = method.toLowerCase();

      log.info('[route]', '%s - %s %s', 'decide', method, re.source);
      router[method](re, function () {
        proxy.decide(this.req, this.res);
      });
    });
  });

  router.proxy = proxy;
  return router;
};
