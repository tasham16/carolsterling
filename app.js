/**
 * Created by davem on 11/26/15.
 */

var static = require('node-static');
console.log("Starting...")
//
// Create a node-static server instance to serve the './public' folder
//
var file = new static.Server('./public');

console.log("Creating server")
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        //
        // Serve files!
        //
        console.log('Serving files...')
        file.serve(request, response);
    }).resume();
    console.log('Listening on port 8080...')
}).listen(8080);

