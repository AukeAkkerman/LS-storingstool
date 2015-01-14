//Voorbeeldscript voor Map met mouseover
//TODO:
//-aanwijzen van monteurs functionaliteit toevoegen

var projection = ol.proj.get('EPSG:3857');

var Alkmaar = ol.proj.transform([4.75355239868168, 52.62976657605367], 'EPSG:4326', 'EPSG:3857');

//Projectie definiëren voor 
proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");
var projectionNL = ol.proj.get('EPSG:28992');
projectionNL.setExtent([646.36, 308975.28, 276050.82, 636456.31]);

var view = new ol.View({
    center: Alkmaar,
    zoom: 17,
    projection: projection
});
var image = new ol.style.Circle({
  radius: 5,
  fill: new ol.style.Fill({
    color: 'rgba(255,0,0,1)'
  }),
  stroke: new ol.style.Stroke({color: 'red', width: 1})
});

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
      color: 'rgba(255, 255, 0, )'
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

//Aparte functie voor Tweet styles

var styleFunctionT = function(feature, resolution) {
  return stylesT[feature.getGeometry().getType()];
};

var stylesT = {
  'Point': [new ol.style.Style({
    image: image
  })]
};

var vectorSourceKLAK = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/KLAK.GeoJSON'
});

var KLAKLayer = new ol.layer.Vector({
  source: vectorSourceKLAK,
  projection: 'EPSG:4326',
  style: styleFunction  
});


var TweetsLayer = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
        url: 'data/Tweet.GeoJSON',
        defaultProjection: 'EPSG:28992',
        projection: 'EPSG:3857'
    }),
    style: styleFunctionT 
});

    
var KlicLayer = new ol.layer.Vector({
   source: new ol.source.GeoJSON({
        url: 'data/KliCAlkmaar.GeoJSON.txt',
        defaultProjection: 'EPSG:3857',
        projection: 'EPSG:3857'
    }),
  style: styleFunction 
});


var Thiessen = new ol.layer.Vector({
   source: new ol.source.GeoJSON({
        url: 'data/Thiessen.GeoJSON',
        defaultProjection: 'EPSG:3857',
        projection: 'EPSG:3857',
        
   }),
  style: styleFunction,
  visible: false
});

var raster = new ol.layer.Tile({
      source: new ol.source.Stamen({
        layer: 'toner'
      })
    })

var map = new ol.Map({
    target: 'map',
    layers: [raster, KLAKLayer, TweetsLayer, KlicLayer, Thiessen],
    view: view
});

//Stuk hieronder is voor de tooltips
var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual',
  placement : 'auto'
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
        .attr('data-original-title', ["Klantnaam: " + feature.get('Klant') + "\n" + "Straatnaam: " + feature.get('STRAAT') + " " + feature.get('NR') + "\n" +  "Ingevoerd door: " + feature.get("Door")])
        .tooltip('fixTitle')
        .tooltip('show');
  } else {
    info.tooltip('hide');
  }
};

//defineren van een Click
$(map.getViewport()).on('click', function(evt) {
  displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});


/*
map.on('click', function(evt) {
  displayFeatureInfo(evt.pixel);
});
*/

//boxje met info

var displayFeatureInfo = function(pixel) {
var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return feature;
  });


  var info2 = document.getElementById('info');
  if (feature) {
    info2.innerHTML = 'Aangemeld door: ' + feature.get('Door') + ' | Klantnaam ' + feature.get('Klant');
      var Tijgerklant = feature.get('Klant');
  } else {
    info2.innerHTML = '&nbsp;';
  }

};

// Handle visibility control

$(document).ready(function() {
    $("#toggle-ls-storingen").on('click', function() {
        KLAKLayer.setVisible(!KLAKLayer.getVisible());
    });
}); 

$(document).ready(function() {
    $("#toggle-klic-werkzaamheden").on('click', function() {
        KlicLayer.setVisible(!KlicLayer.getVisible());
    });
}); 

$(document).ready(function() {
    $("#toggle-twitter-feeds").on('click', function() {
        TweetsLayer.setVisible(!TweetsLayer.getVisible());
    });
}); 

$(document).ready(function() {
    $("#toggle-thiessen-laag").on('click', function() {
        alert('We gaan die storing van ' + Tijgerklant + ' eens even voor je analyseren, penis');
    });
}); 

// Handle on-click functionality

/*var selectClick = new ol.interaction.Select({
  condition: ol.events.condition.click
});
map.addInteraction(selectClick);*/

// Display interactivity in the map
// Hoe selecteer je gegevens uit een JSON bestand?
// http://openlayers.org/en/v3.1.1/examples/select-features.html?q=click
// http://openlayers.org/en/v3.1.1/examples/kml.html?q=kml

//var displayFeatureInfo = function(pixel) {
//  var features = [];
//  map.forEachFeatureAtPixel(pixel, function(feature, layer) {
//    features.push(feature);
//  });
//  if (features.length > 0) {
//    var info = [];
//    var i, ii;
//    for (i = 0, ii = features.length; i < ii; ++i) {
//      info.push(features[i].get('Melding'));
//    }
//    document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
//    map.getTarget().style.cursor = 'pointer';
//  } else {
//    document.getElementById('info').innerHTML = '&nbsp;';
//    map.getTarget().style.cursor = '';
//  }
//};
//
//$(map.getViewport()).on('mousemove', function(evt) {
//  var pixel = map.getEventPixel(evt.originalEvent);
//  displayFeatureInfo(pixel);
//});
