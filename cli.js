#!/usr/bin/env node

var ldj = require('ldjson-stream')
var json2pg = require('./')
var stdout = require('stdout')

var dbURL = process.argv[2]
if (dbURL.indexOf('postgres://') === -1) dbURL = 'postgres://localhost/' + dbURL

var ws = json2pg({db: dbURL})

ws.on('error', function(err) {
  console.error(err)
})

process.stdin.pipe(ldj.parse()).pipe(ws).pipe(stdout())