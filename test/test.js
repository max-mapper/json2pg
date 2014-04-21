var json2pg = require('../')
var stdout = require('stdout')

var ws = json2pg({db: 'postgres://localhost/json-test'})

ws.on('error', function(err) {
  console.error(err)
})

ws.pipe(stdout())

ws.write({id: 1, foo: 'bar'})
ws.write({id: 2, foo: 'baz'})
ws.write({id: 3, foo: 'taco'})
ws.write({id: 4, foo: 'pizza'})
ws.end()