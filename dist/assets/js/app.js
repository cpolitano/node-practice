'use strict';

var http = require('http');
var router = require('./router.js');

var headers = { 'Content-Type': 'text/html' };

http.createServer(function (request, response) {
  response.writeHead(200, headers);
  router.home(request, response);
  router.user(request, response);
}).listen(3000);

console.log('Server running at http://localhost:3000');

'use strict';

console.log('es6 test');

var evens = [2, 4, 6, 8, 10];

var odds = evens.map(function (v) {
  return v + 1;
});

console.log(odds);
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var util = require('util');

// EventEmitter to get a Treehouse student profile

function Profile(username) {

  EventEmitter.call(this);

  profileEmitter = this;

  //Connect to the API URL (http://teamtreehouse.com/username.json)
  var request = http.get('http://teamtreehouse.com/' + username + '.json', function (response) {
    var body = '';

    if (response.statusCode !== 200) {
      request.abort();
      //Status Code Error
      profileEmitter.emit('error', new Error('There was an error getting the profile for ' + username + '. (' + http.STATUS_CODES[response.statusCode] + ')'));
    }

    //Read data
    response.on('data', function (chunk) {
      body += chunk;
      profileEmitter.emit('data', chunk);
    });

    response.on('end', function () {
      if (response.statusCode === 200) {
        try {
          //Parse data
          var profile = JSON.parse(body);
          profileEmitter.emit('end', profile);
        } catch (error) {
          profileEmitter.emit('error', error);
        }
      }
    }).on('error', function (error) {
      profileEmitter.emit('error', error);
    });
  });
}

util.inherits(Profile, EventEmitter);

module.exports = Profile;
'use strict';

var fs = require('fs');

function interpolateValues(values, content) {
  for (var key in values) {
    content = content.replace('{{' + key + '}}', values[key]);
  }
  return content;
}

function view(templateName, values, response) {
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', { encoding: 'utf8' });
  fileContents = interpolateValues(values, fileContents);
  response.write(fileContents);
}

module.exports.view = view;
'use strict';

var Profile = require('./profile.js');
var renderer = require('./render.js');
var querystring = require('querystring');
var headers = { 'Content-Type': 'text/html' };

function home(request, response) {
  if (request.url === '/') {
    if (request.method.toLowerCase() === 'get') {
      response.writeHead(200, headers);
      renderer.view('header', {}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    } else {
      request.on('data', function (postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, { 'Location': '/' + query.username });
        response.end();
      });
    }
  }
}

function user(request, response) {
  var username = request.url.replace('/', '');

  if (username.length > 0) {
    response.writeHead(200, headers);

    var studentProfile = new Profile(username);

    studentProfile.on('end', function (profileJSON) {
      var values = {
        avatarUrl: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        name: profileJSON.name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      };

      renderer.view('header', {}, response);
      renderer.view('profile', values, response);
      renderer.view('footer', {}, response);
      response.end();
    });

    studentProfile.on('error', function (error) {
      renderer.view('header', {}, response);
      renderer.view('error', { errorMessage: error.message }, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    });
  }
}

module.exports.home = home;
module.exports.user = user;