module.exports = [
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/",
    "to": "../../../registry",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/jsonp/:jsonp",
    "to": "_list/short/listAll",
    "method": "GET"
  },
  {
    //
    // - How to handle sessions between two CouchDB servers?
    //
    "from": "/_session",
    "to": "../../../_session",
    "method": "GET"
  },
  {
    //
    // - How to handle sessions between two CouchDB servers?
    //
    "from": "/_session",
    "to": "../../../_session",
    "method": "PUT"
  },
  {
    //
    // - How to handle sessions between two CouchDB servers?
    //
    "from": "/_session",
    "to": "../../../_session",
    "method": "POST"
  },
  {
    //
    // - How to handle sessions between two CouchDB servers?
    //
    "from": "/_session",
    "to": "../../../_session",
    "method": "DELETE"
  },
  {
    //
    // - How to handle sessions between two CouchDB servers?
    //
    "from": "/_session",
    "to": "../../../_session",
    "method": "HEAD"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/all/since",
    "to": "_list/index/modified",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/rss",
    "to": "_list/rss/modified",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/rss/:package",
    "to": "_list/rss/modifiedPackage",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/all",
    "to": "_list/index/listAll",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/all/-/jsonp/:jsonp",
    "to": "_list/index/listAll",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/short",
    "to": "_list/short/listAll",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/scripts",
    "to": "_list/scripts/scripts",
    "method": "GET"
  },
  {
    //
    // - Dead: {
    //   error: "not_found",
    //   reason: "missing"
    // }
    //
    "from": "/-/by-field",
    "to": "_list/byField/byField",
    "method": "GET"
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/fields",
    "to": "_list/sortCount/fieldsInUse",
    "method": "GET",
    "query": {
      "group": "true"
    }
  },
  {
    //
    // - Requires merge of data from public & private npm
    //
    "from": "/-/needbuild",
    "to": "_list/needBuild/needBuild",
    "method": "GET"
  },
  {
    //
    // - Dead: Empty response
    //
    "from": "/-/prebuilt",
    "to": "_list/preBuilt/needBuild",
    "method": "GET"
  },
  //
  // - Dead: {
  //   error: "not_found",
  //   reason: "missing_named_view"
  // }
  //
  {
    "from": "/-/nonlocal",
    "to": "_list/short/nonlocal",
    "method": "GET"
  },
  //
  // - Default to public registry
  //
  {
    "from": "/favicon.ico",
    "to": "../../npm/favicon.ico",
    "method": "GET"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/-/users",
    "to": "../../../_users/_design/_auth/_list/index/listAll",
    "method": "GET"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/-/user/:user",
    "to": "../../../_users/:user",
    "method": "PUT"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/-/user/:user/-rev/:rev",
    "to": "../../../_users/:user",
    "method": "PUT"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/-/user/:user",
    "to": "../../../_users/:user",
    "method": "GET"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/_users/:user",
    "to": "../../../_users/:user",
    "method": "PUT"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/_users/:user",
    "to": "../../../_users/:user",
    "method": "GET"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/public_users/:user",
    "to": "../../../public_users/:user",
    "method": "PUT"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/public_users/:user",
    "to": "../../../public_users/:user",
    "method": "GET"
  },
  //
  // - Default to private registry
  // - Requires authentication
  //
  {
    "from": "/-/user-by-email/:email",
    "to": "../../../_users/_design/_auth/_list/email/listAll",
    "method": "GET"
  },
  //
  // - Requires merge of data from public & private npm
  //
  {
    "from": "/-/top",
    "to": "_view/npmTop",
    "query": {
      "group_level": 1
    },
    "method": "GET"
  },
  //
  // - Requires merge of data from public & private npm
  //
  {
    "from": "/-/by-user/:user",
    "to": "_list/byUser/byUser",
    "method": "GET"
  },
  //
  // - Requires merge of data from public & private npm
  //
  {
    "from": "/-/starred-by-user/:user",
    "to": "_list/byUser/starredByUser",
    "method": "GET"
  },
  //
  // - Requires merge of data from public & private npm
  //
  {
    "from": "/-/starred-by-package/:user",
    "to": "_list/byUser/starredByPackage",
    "method": "GET"
  },
  {
    "from": "/:pkg",
    "to": "/_show/package/:pkg",
    "method": "GET"
  },
  {
    "from": "/:pkg/-/jsonp/:jsonp",
    "to": "/_show/package/:pkg",
    "method": "GET"
  },
  {
    "from": "/:pkg/:version",
    "to": "_show/package/:pkg",
    "method": "GET"
  },
  {
    "from": "/:pkg/:version/-/jsonp/:jsonp",
    "to": "_show/package/:pkg",
    "method": "GET"
  },
  {
    "from": "/:pkg/-/:att",
    "to": "../../:pkg/:att",
    "method": "GET"
  },
  {
    "from": "/:pkg/-/:att/:rev",
    "to": "../../:pkg/:att",
    "method": "PUT"
  },
  {
    "from": "/:pkg/-/:att/-rev/:rev",
    "to": "../../:pkg/:att",
    "method": "PUT"
  },
  {
    "from": "/:pkg/-/:att/:rev",
    "to": "../../:pkg/:att",
    "method": "DELETE"
  },
  {
    "from": "/:pkg/-/:att/-rev/:rev",
    "to": "../../:pkg/:att",
    "method": "DELETE"
  },
  {
    "from": "/:pkg",
    "to": "/_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/-rev/:rev",
    "to": "/_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version/-rev/:rev",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version/-tag/:tag",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version/-tag/:tag/-rev/:rev",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version/-pre/:pre",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/:version/-pre/:pre/-rev/:rev",
    "to": "_update/package/:pkg",
    "method": "PUT"
  },
  {
    "from": "/:pkg/-rev/:rev",
    "to": "../../:pkg",
    "method": "DELETE"
  },
  {
    "from": "/-/package/:pkg/dist-tags",
    "to": "/_show/distTags/:pkg",
    "method": "GET"
  },
  {
    from: "/-/package/:pkg/dist-tags/:tag",
    to: "/_update/distTags/:pkg",
    method: "DELETE"
  },
  {
    from: "/-/package/:pkg/dist-tags/:tag",
    to: "/_update/distTags/:pkg",
    method: "PUT"
  },
  {
    from: "/-/package/:pkg/dist-tags/:tag",
    to: "/_update/distTags/:pkg",
    method: "POST"
  },
  {
    from: "/-/package/:pkg/dist-tags",
    to: "/_update/distTags/:pkg",
    method: "PUT"
  },
  {
    from: "/-/package/:pkg/dist-tags",
    to: "/_update/distTags/:pkg",
    method: "POST"
  },
  {
    "from": "/-/_view/*",
    "to": "_view/*",
    "method": "GET"
  },
  {
    "from": "/-/_list/*",
    "to": "_list/*",
    "method": "GET"
  },
  {
    "from": "/-/_show/*",
    "to": "_show/*",
    "method": "GET"
  }
]