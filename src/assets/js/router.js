'use strict';

var Profile = require('./profile.js');
var renderer = require('./render.js');
var querystring = require('querystring');
var headers = {'Content-Type': 'text/html'};

function home(request, response){
  if ( request.url === '/') {
    if ( request.method.toLowerCase() === 'get' ) {
      response.writeHead(200, headers);
      renderer.view('header', {}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    } else {
      request.on('data', function(postBody) {
        var query = querystring.parse(postBody.toString());
        response.writeHead(303, {'Location': '/' + query.username});
        response.end();
      });
    }

  }
}

function user(request, response) {
  var username = request.url.replace('/', '');

  if ( username.length > 0 ) {
    response.writeHead(200, headers);

    var studentProfile = new Profile(username);

    studentProfile.on('end', function(profileJSON){
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

    studentProfile.on('error', function(error){
      renderer.view('header', {}, response);
      renderer.view('error', {errorMessage: error.message}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    });

  }
}

module.exports.home = home;
module.exports.user = user;
