'use strict';

var http = require('http');
var router = require('./router.js');

var headers = {'Content-Type': 'text/html'};


http.createServer(function (request, response) {
  response.writeHead(200, headers);
  router.home(request, response);
  router.user(request, response);
}).listen(3000);

console.log('Server running at http://localhost:3000');
