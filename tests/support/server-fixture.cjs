'use strict';
const http = require('node:http');
const createServer = http.createServer;
http.createServer = function (...args) {
  const server = createServer.apply(this, args);
  server.once('listening', () => process.send({ port: server.address().port }));
  return server;
};
require(process.argv[2]);
