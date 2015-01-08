//Voorbeeldscript voor Map met mouseover
//TODO:
//-aanwijzen van monteurs functionaliteit toevoegen

var projection = ol.proj.get('EPSG:3857');
var amsterdam = ol.proj.transform([4.53, 52.22], 'EPSG:4326', 'EPSG:3857');

var view = new ol.View({
//    center: [876970.8463461736, 5859807.853963373],
//    projection: projection,
//    zoom: 10
    center: amsterdam,
    zoom: 10,
    projection: projection
});

var image = new ol.style.Circle({
  radius: 5,
  fill: new ol.style.Fill({
    color: 'rgba(255,0,0,1)'
  }),
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

//halloooooo

var styles = {
  'Point': [new ol.style.Style({
    image: new ol.style.Icon(({
                            src: 'Klakmelding/telefoon.png'
                        }))
  })],
  'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiLineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 1
    })
  })],
  'MultiPoint': [new ol.style.Style({
    image: image
  })],
  'MultiPolygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'yellow',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  })],
  'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'blue',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  })],
  'GeometryCollection': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'magenta',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'magenta'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'magenta'
      })
    })
  })],
  'Circle': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })]
};

var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};


var vectorSource = new ol.source.GeoJSON({
    object: '{"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:EPSG::3857"}},"features":[{"type":"Feature","properties":{"OBJECTID":1,"Melding":325220,"Klant":"F. Timmer","PC":"1811BE ","STRAAT":"Verdronkenoord","NR":"24","Toev":null,"Woonplaats":"Alkmaar","Geregistreerd_op":"14-11-2014 13:48","Door":"Carlos Monteiro"},"geometry":{"type":"Point","coordinates":[529168.4109813292,6914652.7978503425]}},{"type":"Feature","properties":{"OBJECTID":2,"Melding":325217,"Klant":"J. van der Zwan","PC":"1811NJ ","STRAAT":"Bierkade","NR":"12","Toev":null,"Woonplaats":"Alkmaar","Geregistreerd_op":"14-11-2014 13:49","Door":"Frans van der Heijde"},"geometry":{"type":"Point","coordinates":[529340.2840449822,6914693.649550405]}},{"type":"Feature","properties":{"OBJECTID":3,"Melding":325218,"Klant":"K. Hoedjes","PC":"1811NJ ","STRAAT":"Bierkade","NR":"13","Toev":null,"Woonplaats":"Alkmaar","Geregistreerd_op":"14-11-2014 13:51","Door":"Roy de Weers"},"geometry":{"type":"Point","coordinates":[529335.9142864599,6914685.666555622]}},{"type":"Feature","properties":{"OBJECTID":4,"Melding":325215,"Klant":"S. Janssen","PC":"1811MT ","STRAAT":"Luttik Oudorp","NR":"9","Toev":null,"Woonplaats":"Alkmaar","Geregistreerd_op":"14-11-2014 13:56","Door":"Jan van de Berg"},"geometry":{"type":"Point","coordinates":[529367.234408643,6914791.563384929]}},{"type":"Feature","properties":{"OBJECTID":5,"Melding":325215,"Klant":"J. Kraandijk","PC":"1811MT ","STRAAT":"Luttik Oudorp","NR":"39","Toev":null,"Woonplaats":"Alkmaar","Geregistreerd_op":"14-11-2014 13:48","Door":"Dirk Bol"},"geometry":{"type":"Point","coordinates":[529280.7213670305,6914841.7875869265]}}]}'
});

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  projection: 'EPSG:4326',
  style: styleFunction  
});

var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'toner'
  })
});



var map = new ol.Map({
    target: 'map',
    layers: [raster, vectorLayer],
    view: view
});

//Stuk hieronder is voor de tooltips

var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual'
});

var displayFeatureInfo = function(pixel) {
  info.css({
    left: pixel[0] + 'px',
    top: (pixel[1] - 15) + 'px'
  });
  var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });
  if (feature) {
    info.tooltip('hide')
        .attr('data-original-title', ["Je weet wel die bokkelul: " + feature.get('Klant') + "\n" + "Straatnaam: " + feature.get('STRAAT') + " " + feature.get('NR')])
        .tooltip('fixTitle')
        .tooltip('show');
  } else {
    info.tooltip('hide');
  }
};

$(map.getViewport()).on('mousemove', function(evt) {
  displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);
});

// Handle visibility control

$(document).ready(function() {
    $("#toggle-ls-storingen").on('click', function() {
        vectorLayer.setVisible(!vectorLayer.getVisible());
    });
}); 