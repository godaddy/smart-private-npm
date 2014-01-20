# smart-private-npm

An intelligent routing proxy for npm with support for: private, whitelisted, and blacklisted packaged

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
      npm: url.parse('http://user:pass@registry.nodejitsu.com'),
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
    http: 80
    https: {
      port: 443,
      root: '/path/to/your/ssl/files',
      key: 'your-ssl.key',  // or .pem
      key: 'your-ssl.cert', // or .pem
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

#### License: Apache2
#### Author: [Nodejitsu Inc.](https://nodejitsu.com)
#### Contributors: [Charlie Robbins](https://github.com/indexzero), [Jarrett Cruger](https://github.com/jcrugzz)
