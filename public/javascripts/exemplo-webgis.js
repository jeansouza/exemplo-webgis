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

  var socket = io.connect(window.location.origin, { path: '/socket.io' });

  var singleClickEventKey = null;

  // Methods

  var setSortable = function() {
    if(typeof $('#layers > ul').sortable === "function") {
      $('#layers > ul').sortable({
        items: "li",
        start: function(event, ui) {
          $(this).attr('data-previndex', (ui.item[0].parentNode.childElementCount - 2) - ui.item.index());
        },
        update: function(event, ui) {
          var layers = map.getLayers();
          var layer = layers.removeAt($(this).attr('data-previndex'));
          layers.insertAt((ui.item[0].parentNode.childElementCount - 1) - ui.item.index(), layer);

          $(this).removeAttr('data-previndex');
        }
      });

      $('#layers > ul').disableSelection();
    }
  };

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

  var setGetFeatureInfoUrlOnClick = function(layerId, callback) {
    unsetSingleClickEventKey();

    singleClickEventKey = map.on('click', function(e) {
      var layer = findBy(map.getLayerGroup(), 'id', layerId);

      if(layer !== null) {
        try {
          var url = layer.getSource().getGetFeatureInfoUrl([e.coordinate[0], e.coordinate[1]], map.getView().getResolution(), 'EPSG:4326', { 'INFO_FORMAT': 'application/json' });
        } catch(e) {
          var url = null;
        }

        callback(url);
      } else callback(null);
    });
  };

  var unsetSingleClickEventKey = function() {
    if(singleClickEventKey !== null) ol.Observable.unByKey(singleClickEventKey);
  };

  // Events

  $("#layers").on("click", "ul > li > input", function(ev) {
    var layerId = $(this).closest('li').data('id');
    var layer = findBy(map.getLayerGroup(), 'id', layerId);

    if(layer !== null)
      layer.setVisible(!layer.getVisible());
  });

  $("#get-layer-information").on("click", function() {
    setGetFeatureInfoUrlOnClick('exemplo-webgis:estados', function(url) {
      if($('#feature-info-box').hasClass('ui-dialog-content'))
        $('#feature-info-box').dialog('close');

      if(url !== null)
        socket.emit('getFeatureInfo', {
          url: url,
          params: {
            layerName: "Estados"
          }
        });
    });
  });

  socket.on('getGeoJsonResponse', function(result) {
    if(!result.error) {
      addLayer(new ol.layer.Vector({
        source: new ol.source.Vector({
          features: (new ol.format.GeoJSON()).readFeatures(result.result.rows[0].geojson)
        }),
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.1)'
          })
        }),
        id: "exemplo-webgis:municipios_acre",
        name: "Municípios Acre"
      }));
    }

    setSortable();
  });

  socket.on('getFeatureInfoResponse', function(data) {
    var featureInfo = data.msg;
    var featuresLength = featureInfo.features.length;

    if(featuresLength > 0) {
      var firesAttributes = "";

      for(var i = 0; i < featuresLength; i++) {
        firesAttributes += "<table class=\"table table-striped\"><tbody>";

        for(var key in featureInfo.features[i].properties) {
          firesAttributes += "<tr><td><strong>" + key + "</strong></td><td>" + featureInfo.features[i].properties[key] + "</td></tr>";
        }

        firesAttributes += "</tbody></table>";
        if(featuresLength > (i + 1)) firesAttributes += "<hr/>";
      }

      $('#feature-info-box').html(firesAttributes);

      $('#feature-info-box').dialog({
        dialogClass: "feature-info-box",
        title: "Atributos da camada: " + data.params.layerName,
        width: 400,
        height: 380,
        modal: false,
        resizable: true,
        draggable: true,
        closeOnEscape: true,
        closeText: "",
        position: {
          my: 'top',
          at: 'top+75'
        },
        open: function() {
          $('.ui-dialog-titlebar-close').css('background-image', 'url(images/close.png)');
          $('.ui-dialog-titlebar-close').css('background-position', 'center');
          $('.ui-dialog-titlebar-close').css('background-size', '20px');
        },
        close: function() {
          $('.ui-dialog-titlebar-close').css('background-image', '');
          $('.ui-dialog-titlebar-close').css('background-position', '');
          $('.ui-dialog-titlebar-close').css('background-size', '');
        }
      });
    }
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

  socket.emit('getGeoJson');

  $(".ol-attribution > button > span").text("?");
});