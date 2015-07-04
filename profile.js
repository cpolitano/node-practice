var EventEmitter = require('events').EventEmitter;
var http = require('http');
var util = require('util');

// EventEmitter to get a Treehouse student profile

function Profile(username) {

    EventEmitter.call(this);

    profileEmitter = this;

    //Connect to the API URL (http://teamtreehouse.com/username.json)
    var request = http.get('http://teamtreehouse.com/' + username + '.json', function(response) {
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
            if(response.statusCode === 200) {
                try {
                    //Parse data
                    var profile = JSON.parse(body);
                    profileEmitter.emit('end', profile);
                } catch (error) {
                    profileEmitter.emit('error', error);
                }
            }
        }).on('error', function(error){
            profileEmitter.emit('error', error);
        });
    });
}

util.inherits( Profile, EventEmitter );

module.exports = Profile;