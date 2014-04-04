var common = require('./fixtures/common')
  , pubServer = require('./fixtures/public')
  , pubServer2 = require('./fixtures/public2')
  , privServer = require('./fixtures/private')
  , Mocha = require('mocha')
  , fs = require('fs')
  , path = require('path')

var opts = {
  ui: 'bdd',
  reporter: process.env.REPORTER || 'spec'
}

var mocha = new Mocha(opts)

fs.readdirSync(__dirname).filter(function(file) {
  return path.extname(file) === '.js'
}).filter(function(file) {
  return path.basename(file) !== 'test.js'
}).forEach(function(file) {
  mocha.addFile(path.join(__dirname, file))
})

//mocha.addFile(path.join(__dirname, 'npm-proxy-basic.js'))
function start(cb) {
  var count = 0
  function done() {
    count++
    if (count === 3) {
      return cb()
    }
  }

  pubServer.start(done)
  pubServer2.start(done)
  privServer.start(done)
}

function stop(cb) {
  var count = 0
  function done() {
    count++
    if (count === 3) {
      return cb()
    }
  }

  pubServer.stop(cb)
  pubServer2.stop(cb)
  privServer.stop(cb)
}

start(function(err) {
  if (err) throw err
  mocha.run(function(fail) {
    process.exit(fail)
  })
})
