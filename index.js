var pg = require('pg')
var uuid = require('hat')
var url = require('url')
var through = require('through2')

module.exports = function(opts) {
  var parsed = url.parse(opts.db)
  var invalidErr = new Error('Must specify db similar to: postgres://localhost/foo')
  var dbName = parsed.path.slice(1)
  if (!dbName) throw invalidErr
  if (parsed.protocol !== 'postgres:') throw invalidErr
  var client = new pg.Client(opts.db)
  var hasEnded = false
  var hasDrained = false
  
  client.connect(function(err) {
    if (err) writeStream.emit('error', err)
  })
  
  client.on("drain", function() {
    if (hasEnded) end()
    hasDrained = true
  })
  
  var extraArgs = opts.createTableArgs || ''
  if (extraArgs) extraArgs = ' ' + extraArgs + ','
  var createTable = 'CREATE TABLE IF NOT EXISTS "'
    + dbName +  '" (id '
    + (opts.idType || "varchar")
    + " NOT NULL,"
    + extraArgs
    + " properties JSON, PRIMARY KEY(id))"
    
  client.query(createTable, function(err) {
    if (err) writeStream.emit('error', err)
  })

  var writeStream = through.obj(write, function(cb) {
    cb()
    if (hasDrained) end()
    hasEnded = true
  })
  
  function write(obj, enc, next) {
    var insertQuery = 'INSERT INTO "' + dbName + '" (id, properties) VALUES ($1, $2)'

    if (!obj.id) obj.id = uuid()
    var id = obj.id
    delete obj.id
    
    var params = [
      id,
      obj
    ]

    client.query(insertQuery, params, function(err) {
      if (err) writeStream.push(err)
      else writeStream.push({ok: true, message: 'Wrote ' + id})
      next()
    })
  }
  
  function end(cb) {
    writeStream.end()
    client.end()
  }
  
  return writeStream
}
