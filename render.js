'use strict';

var fs = require('fs');

function interpolateValues(values, content) {
  for ( var key in values ) {
    content = content.replace('{{' + key + '}}', values[key]);
  }
  return content;
}

function view(templateName, values, response) {
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'});
  fileContents = interpolateValues(values, fileContents);
  response.write(fileContents);
}

module.exports.view = view;