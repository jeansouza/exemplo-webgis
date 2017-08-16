/**
 * @author Jean Souza [jeancfsouza@gmail.com]
 */

var GetGeoJson = function(io) {

  var sockets = io.sockets;
  var http = require('http');

  // Socket connection event
  sockets.on('connection', function(socketClient) {

    // Proxy request event
    socketClient.on('getFeatureInfo', function(json) {

      // Http request to the received url
      http.get(json.url, function(resp) {
        var body = '';
        // Data receiving event
        resp.on('data', function(chunk) {
          body += chunk;
        });

        // End of request event
        resp.on('end', function() {
          try {
            body = JSON.parse(body);
          } catch(ex) {
            body = {};
          }

          // Socket response
          socketClient.emit('getFeatureInfoResponse', { msg: body, params: json.params });
        });
      }).on("error", function(e) {
        socketClient.emit('getFeatureInfoResponse', { msg: {}, params: json.params });
      });
    });
  });
};

module.exports = GetGeoJson;
