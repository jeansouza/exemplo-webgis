/**
 * @author Jean Souza [jeancfsouza@gmail.com]
 */

var GetGeoJson = function(io) {

  var sockets = io.sockets;
  var Pg = require('pg');

  // Socket connection event
  sockets.on('connection', function(socketClient) {

    // Proxy request event
    socketClient.on('getGeoJson', function(json) {
      
      var pg = new Pg.Client({
        host: 'localhost',
        port: 5432,
        database: 'exemplo-webgis',
        user: 'postgres',
        password: 'postgres',
      });

      pg.connect(function(err, client, done) {
        if(!err) {
          client.query("SELECT row_to_json(fc) as geojson FROM (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(mun.geom)::json As geometry, row_to_json((gid, id, cd_geocodm, nm_municip)) As properties FROM public.municipios_acre As mun) As f) As fc;", function(err, result) {
            if(!err) {
              pg.end();
              socketClient.emit('getGeoJsonResponse', { error: null, result: result });
            } else {
              socketClient.emit('getGeoJsonResponse', { error: err });
            }
          });
        } else {
          socketClient.emit('getGeoJsonResponse', { error: err });
        }
      });
    });
  });
};

module.exports = GetGeoJson;
