# smart-private-npm

[![build
status](https://secure.travis-ci.org/nodejitsu/smart-private-npm.png)](http://travis-ci.org/nodejitsu/smart-private-npm)

An intelligent routing proxy for npm with support for: private, whitelisted, and blacklisted packages.

* [Sample Usage](#sample-usage)
* [Understanding a policy](#understanding-a-policy)

## Sample Usage

_n.b. Default CouchDB rewrites automatically loaded from [config/rewrites.js](https://github.com/nodejitsu/smart-private-npm/blob/master/config/rewrites.js)._

``` js
  var smartPrivateNpm = require('smart-private-npm'),
      url = require('url');

  //
  // Configure your private npm. You could load this in from a file
  // somewhere
  //
  var config = {
    //
    // Private npm options.
    //
    rewrites: require('./config/rewrites'),
    proxy: {
      //
      // This can optionally just be a single url.parsed URL or an array to
      // cycle through. Optionally you can also have an array of url.parsed urls
      // as well
      //
      npm: {
        read: url.parse('http://user:pass@registry.nodejitsu.com'),
        write: url.parse('https://registry.npmjs.org')
      },
      policy: {
        npm: url.parse('http://user:pass@private.registry.nodejitsu.com'),
        private: {
          //
          // This is the list of "known private modules"
          // that will always be proxied to the private npm.
          // It is built over time by remembering "publish" requests.
          //
        },
        blacklist: {
          //
          // This is the list of modules that will ALWAYS be proxies
          // to the private npm, no matter what.
          //
        },
        whitelist: {
          //
          // If enabled: only requests for these modules will be served
          // by the proxy (unless they are "known private modules").
          //
        },
        //
        // In "transparent mode" the proxy will always forward to
        // the public registry.
        //
        transparent: false
      }
    },
    //
    // Server options (from "create-servers")
    //
    http: 80,
    https: {
      port: 443,
      root: '/path/to/your/ssl/files',
      key: 'your-ssl.key',  // or .pem
      cert: 'your-ssl.cert' // or .pem
    }
  };

  smartPrivateNpm.createServer(config, function (err, servers) {
    if (err) {
      console.log('Error starting private npm: %j', servers);
      return process.exit(1);
    }

    console.log('Private npm running on %j servers.', Object.keys(servers));
  });
```

## Understanding a Policy

In order to get your `smart-private-npm` setup you'll need to decide on a policy for your users, which are assumed to be authenticated by the [CouchDB and the npm CouchApp](http://github.com/npm/npmjs.org). A policy is composed of:

* **Private:** This is the set of "known private packages" which _are always proxied to your private CouchDB server._ All new `publish` requests are also proxied to your private CouchDB server.
* **Blacklist:** These packages are explicitly forbidden to be retrieved from the public npm. _It is possible for a package to be both private and blacklisted._ This is how you can take ownership over a given module.
* **Whitelist:** If set, _**only**_ these packages (and all private npm packages) will be permitted from the public npm registry.

Both the sets of whitelisted and blacklisted packages are read from on start time and require updating from the caller.

##### License: Apache2
##### Author: [Nodejitsu Inc.](https://nodejitsu.com)
##### Contributors: [Charlie Robbins](https://github.com/indexzero), [Jarrett Cruger](https://github.com/jcrugzz)
