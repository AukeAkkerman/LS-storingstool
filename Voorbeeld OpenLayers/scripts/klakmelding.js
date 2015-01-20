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
//algemene definitie van de style voor LS aansluitingen
var image = new ol.style.Circle({
  radius: 5,
  fill: new ol.style.Fill({
    color: 'rgba(30,200,100,0.6)'
  }),
  stroke: new ol.style.Stroke({color: 'green', width: 1})
});

//definitie stylesT
var stylesT = {
  'Point': [new ol.style.Style({
    image: image
  })]
};

//algemene definitie LS kabels en KLAK meldingen
var styles = {
  'Point': [new ol.style.Style({
    image: new ol.style.Icon(({
                            src: 'Klakmelding/telefoon.png'
                        }))
  })],
  'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(200,50,50,0.8)',
      width: 2
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

//stijl voor MSkabels
var stylesMS = {
    'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(50,130,200,0.8)',
      width: 3
    })
    })]

};
    

//Styles voor de verschillende lagen
var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

//Aparte functie voor Tweet styles
var styleFunctionT = function(feature, resolution) {
  return stylesT[feature.getGeometry().getType()];
};

//definitieve styles van  MS gedeelte
var styleFunctionMS = function(feature, resolution) {
  return stylesMS[feature.getGeometry().getType()];
};


//Klakmeldingen inladen
var vectorSourceKLAK = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/KLAK.GeoJSON'
});
//LSKabels inladen
var vectorSourceKabelsLS = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_LS_Kabels.GeoJSON'
});

//MSkabels inladen
var vectorSourceKabelsMS = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_MS_Kabel_sel.GeoJSON'
});

// test met WFS importeren

 // Source retrieving WFS data in GML format using AJAX
            var vectorSource = new ol.source.ServerVector({
                format: new ol.format.WFS({
                    featureNS: 'http://esritst:6080/arcgis/services/DNB/storingintake/MapServer/WFSServer',
                    featureType: 'MV_NRG_MS_KABELS'
                }),
                loader: function(extent, resolution, projection) {
                    var url = 'http://esritst:6080/arcgis/services/DNB/storingintake/MapServer/WFSServer?'+
                        'service=WFS&request=GetFeature&'+
                        'version=1.1.0&typename=DNB_storingintake:MV_NRG_MS_KABELS&'+
                        'srsname=EPSG:3857';

                    $.ajax({
                        url: url
                    })
                    .done(function(response) {
                        vectorSource.addFeatures(vectorSource.readFeatures(response));
                    });
                },
                strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                    maxZoom: 19
                })),
                projection: 'EPSG:3857'
            });

            // Vector layer
            var vector = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'green',
                        width: 2
                    })
                })
            });

//Aansluitingen inladen
var vectorSourceAansl = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/Aansluitingen_inclslim.GeoJSON'
});

//Klakmeldingen projecteren
var KLAKLayer = new ol.layer.Vector({
  source: vectorSourceKLAK,
  projection: 'EPSG:4326',
  style: styleFunction  
});
//LS Kabels projecteren
var KabelLayerLS = new ol.layer.Vector({
  source: vectorSourceKabelsLS,
  projection: 'EPSG:4326',
  style: styleFunction,
  maxResolution: '1'
});

//MS Kabels projecteren
var KabelLayerMS = new ol.layer.Vector({
  source: vectorSourceKabelsMS,
  projection: 'EPSG:4326',
  style: styleFunctionMS,
  maxResolution: '4'
});

//Aansluitingen projecteren
var AanslLayer = new ol.layer.Vector({
  source: vectorSourceAansl,
  projection: 'EPSG:4326',
  style: styleFunctionT,
  maxResolution: '2'    
});

//tweets laden en projecteren
var TweetsLayer = new ol.layer.Vector({
  source: new ol.source.GeoJSON({
        url: 'data/Tweet.GeoJSON',
        defaultProjection: 'EPSG:28992',
        projection: 'EPSG:3857'
    }),
    style: styleFunctionT 
});

//Klic laden en projecteren    
var KlicLayer = new ol.layer.Vector({
   source: new ol.source.GeoJSON({
        url: 'data/KliCAlkmaar.GeoJSON.txt',
        defaultProjection: 'EPSG:3857',
        projection: 'EPSG:3857'
    }),
  style: styleFunction 
});

//Thiessen polygonen van aansluitingen laden en projecteren
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
    layers: [raster, vector, KabelLayerLS, AanslLayer, KabelLayerMS, KLAKLayer, TweetsLayer, KlicLayer, Thiessen],
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
//toevoegen van selectiekader
var select = null;
var selectMouseMove = new ol.interaction.Select({
  condition: ol.events.condition.MouseMove
});
map.addInteraction(selectMouseMove);

var changeInteraction = function() {
  if (select !== null) {
    map.removeInteraction(select);
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
    info2.innerHTML = feature.get('Door');
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
