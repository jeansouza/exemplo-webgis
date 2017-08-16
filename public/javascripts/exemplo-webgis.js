/**
 * @author Jean Souza [jeancfsouza@gmail.com]
 */

$(document).ready(function() {

  // Attributes

  var map = new ol.Map({
    target: 'map',
    view: new ol.View({
      extent: [-180, -90, 180, 90],
      center: [-55, -15],
      zoom: 4,
      projection: ol.proj.get("EPSG:4326")
    })
  });

  // Methods

  var addLayer = function(layer) {
    map.addLayer(layer);
    $("#layers > ul").prepend("<li data-id='" + layer.get('id') + "'><input checked type='checkbox'/> <span>" + layer.get('name') + "</span></li>");
  };

  var findBy = function(layer, key, value) {
    if(layer.get(key) === value)
      return layer;

    if(layer.getLayers) {
      var layers = layer.getLayers().getArray(),
      len = layers.length, result;
      for(var i = 0; i < len; i++) {
        result = findBy(layers[i], key, value);
        if(result)
          return result;
      }
    }

    return null;
  };

  // Events

  $("#layers").on("click", "ul > li > input", function(ev) {
    var layerId = $(this).closest('li').data('id');
    var layer = findBy(map.getLayerGroup(), 'id', layerId);

    if(layer !== null)
      layer.setVisible(!layer.getVisible());
  });

  // Main

  addLayer(new ol.layer.Tile({
    source: new ol.source.OSM(),
    id: "osm",
    name: "OpenStreetMap"
  }));

  addLayer(new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: "http://localhost:8080/geoserver/ows",
      params: {
        LAYERS: "exemplo-webgis:estados"
      }
    }),
    id: "exemplo-webgis:estados",
    name: "Estados"
  }));
});