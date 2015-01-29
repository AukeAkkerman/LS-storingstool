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

//definitie styles voor LS aansluitingen
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
      color: 'Red',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(200, 250, 200, 0.6)'
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
//SelectieStyle
var bluePhone = new ol.style.Style({
    image: new ol.style.Icon(({
                            src: 'Klakmelding/telefoon_2.png'
                        }))
    });
//stijl voor MSkabels
var stylesMS = {
    'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(50,130,200,0.8)',
      width: 3
    })
    })]

};
    

//Styles voor de verschillende lagen met een selectie eigenschap erin
var styleFunction = function(feature, resolution) {
//      return styles[feature.getGeometry().getType()];
if (feature.get("type")) {
        return styles[feature.get("type")];
    }
    else{ 
        return styles[feature.getGeometry().getType()]; 
    }
};


//Aparte functie voor Tweet styles
var styleFunctionT = function(feature, resolution) {
//      return stylesT[feature.getGeometry().getType()];
    if (feature.get("type")) {
          return stylesT[feature.get("type")];
        }
    else{ 
        return stylesT[feature.getGeometry().getType()]; 
    }
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

//MSRs inladen
var vectorSourceMSR = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_stationsbehuizing_sel.GeoJSON'
});
// test met WFS importeren

 // Source retrieving WFS data in GML format using AJAX
                      // Source retrieving WFS data in GML format using AJAX
            var vectorSource = new ol.source.ServerVector({
                format: new ol.format.WFS({
                    featureNS: 'http://openstreemap.org',
                    featureType: 'water_areas'
                }),
                loader: function(extent, resolution, projection) {
                    var url = 'http://demo.boundlessgeo.com/geoserver/wfs?service=WFS&' +
        'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
        'outputFormat=text/javascript&format_options=callback:loadFeatures' +
        '&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';

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
                projection: 'EPSG:3857',
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
  style: styleFunction,
  name: 'KLAKLayer'
});
//LS Kabels projecteren
var KabelLayerLS = new ol.layer.Vector({
  source: vectorSourceKabelsLS,
  projection: 'EPSG:4326',
  style: styleFunction,
  maxResolution: '2',
  name: 'KabelLayerLS'
});

//MS Kabels projecteren
var KabelLayerMS = new ol.layer.Vector({
  source: vectorSourceKabelsMS,
  projection: 'EPSG:4326',
  style: styleFunctionMS,
  maxResolution: '4',
  name: 'KabelLayerMS'
});

//Aansluitingen projecteren
var AanslLayer = new ol.layer.Vector({
  source: vectorSourceAansl,
  projection: 'EPSG:4326',
  style: styleFunctionT,
  maxResolution: '1',
  name: 'AanslLayer'
});


//MSR behuizing polygonen laden en projecteren
var MSRLayer = new ol.layer.Vector({
  source: vectorSourceMSR,
  projection: 'EPSG:4326',
  style: styleFunction,
  maxResolution: '5'
});


var raster = new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'osm'})
}); 

var map = new ol.Map({
    target: 'map',
    layers: [raster, vector, KabelLayerLS, AanslLayer, KabelLayerMS, KLAKLayer, MSRLayer],
    view: view
});

//Stuk hieronder is voor de tooltips
var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual',
});

var displayFeatureInfo_MouseOver = function(pixel) {
  info.css({
    left: (pixel[0] + 10) + 'px',
    top: (pixel[1] + 40) + 'px'
  });
  var featureInfo = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return [feature, layer];
  });
  if (featureInfo) {
    info.tooltip('hide')
    if (featureInfo[1].get("name") == "KLAKLayer") {
        info.attr('data-original-title', ["KLAKMELDING" + "\n" +  "Klantnaam: " + featureInfo[0].get('Klant') + "\n" + "Straatnaam: " + featureInfo[0].get('STRAAT') + " " + featureInfo[0].get('NR') + "\n" +  "Ingevoerd door: " + featureInfo[0].get("Door")])
        info.tooltip('fixTitle')
        info.tooltip('show');
    } else if (featureInfo[1].get("name") == "AanslLayer") {
        info.attr('data-original-title', ["AANSLUITING " + "\n" + "EAN Code: " + featureInfo[0].get('EAN') + "\n" + "Adres: " + featureInfo[0].get('ARI_ADRES') + "\n" +  "Nominale Capaciteit " + featureInfo[0].get('NOMINALE_CAPACITEIT') + "\n" + "Slimme Meter?: " + featureInfo[0].get('SlimmeMeter')])
        info.tooltip('fixTitle')
        info.tooltip('show');
    } else if (featureInfo[1].get("name") == "KabelLayer") {
        info.attr('data-original-title', ["KABEL " + "\n" + "Hoofdleiding NR: " + featureInfo[0].get('HOOFDLEIDING') + "\n" + "Uitvoering: " + featureInfo[0].get('UITVOERING_SCHETS') + "\n" +  "Lengte: " + featureInfo[0].get('LIGGING_Length')])
        info.tooltip('fixTitle')
        info.tooltip('show');
    }
  } else {
    info.tooltip('hide');
  }
};

//defineren van een Click
$(map.getViewport()).on('mousemove', function(evt) {
  displayFeatureInfo_MouseOver(map.getEventPixel(evt.originalEvent));
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


   var DatumTijd = document.getElementById('DatumTijd');
  if (feature) {
    DatumTijd.innerHTML = feature.get('Geregistreerd_op');
  } else {
    DatumTijd.innerHTML = '&nbsp;';
  }
    var AangDo = document.getElementById('AangDo');
  if (feature) {
    AangDo.innerHTML = feature.get('Door');
  } else {
    AangDo.innerHTML = '&nbsp;';
  }

  var Beller = document.getElementById('Beller');
  if (feature) {
    Beller.innerHTML = feature.get('Klant');
  } else {
    Beller.innerHTML = '&nbsp;';
  }
  
  var HldID = document.getElementById('HldID');
  if (feature) {
    HldID.innerHTML = 'Nog niet bekend';
  } else {
    HldID.innerHTML = '&nbsp;';
  }
    
};

//toevoegen van selectiekader
var select = null;
var selectMouseClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    style: bluePhone,
    layers: [KLAKLayer]
});
map.addInteraction(selectMouseClick);

var changeInteraction = function() {
  if (select !== null) {
    map.removeInteraction(select);
  }
};

selectMouseClick.getFeatures().on("change:length", function () {
    for (var i=0; i < vectorSourceKabelsLS.getFeatures().length; i++) {
        var feature = vectorSourceKabelsLS.getFeatures()[i];
        feature.set("type", "LineString");
    }
});


//Popup functie voor de gevonden kabel

var element = document.getElementById('#info2');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false
});
map.addOverlay(popup);


var displayFeatureInfo_onClick = function(featureInfo) {
  info.css({
    left: (pixel[0] + 10) + 'px',
    top: (pixel[1] + 40) + 'px'
  });
  if (featureInfo) {
    info.tooltip('hide')
    info.attr('data-original-title', ["KABEL " + "\n" + "Hoofdleiding NR: " + featureInfo[0].get('HOOFDLEIDING') + "\n" + "Uitvoering: " + featureInfo[0].get('UITVOERING_SCHETS') + "\n" +  "Lengte: " + featureInfo[0].get('LIGGING_Length')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else {
    info.tooltip('hide');
  }
};

//functie om de maximale extent te bepalen

function myMax(a)
{
    var m = -Infinity, i = 0, n = a.length;

    for (; i != n; ++i) {
        if (a[i] > m) {
            m = a[i];
        }
    }

    return m;
}

function myMin(a)
{
    var m = Infinity, i = 0, n = a.length;

    for (; i != n; ++i) {
        if (a[i] < m) {
            m = a[i];
        }
    }

    return m;
}

function maxExtent(inputArray) {
    resultArray = [];
    for(var i=0; i<inputArray[0].length; i++){
        tempArray = [];
        for(var j=0; j<inputArray.length;j++){
            tempArray.push(inputArray[j][i]);   
        }
        if(i == 0 | i == 1) {
            resultArray.push(myMin(tempArray));
        }
        if(i == 2 | i == 3) {
            resultArray.push(myMax(tempArray));
        }
    }
    return resultArray;
}

   $('#toon-achterl-kabel').on('click', function(){
        if(selectMouseClick) {
            //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
            var features = selectMouseClick.getFeatures();
            var selectedFeature = features.item(0);
            var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
//            window.alert(ARI);
            //Find corresponding name in other layer
            for (var i=0; i < vectorSourceAansl.getFeatures().length; i++) {
                
                var feature = vectorSourceAansl.getFeatures()[i];
                if (feature.get("ARI_ADRES") == ARI) {
                    var HLD_tevinden = feature.get("HOOFDLEIDING");
                    //Array om de maximale extent te bepalen en waar de zoom uiteindelijk heenmoet
                    var ExtentArray = [];
                    for (var j=0; j< vectorSourceKabels.getFeatures().length; j++) {
                    
                        var KabelID = vectorSourceKabels.getFeatures()[j];
                        if (KabelID.get("HOOFDLEIDING") == HLD_tevinden){
                            KabelID.set("type", "LineStringSelected");
                            ExtentArray.push(KabelID.getGeometry().getExtent());
                            //Nu vervolgens de hele kabel inzoomen
                            
                        }
//                        else {
//                            KabelID.set("type", "LineString");
//                        }
                    }
                    if (ExtentArray.length != 0) {
                        var NewExtent = maxExtent(ExtentArray);
                        map.getView().fitExtent(NewExtent, map.getSize());
                    }
                    break;
                } 
//                    else {
//                    feature.set("type", "Point");
//                }
            }
        } else {
         window.alert("You have not selected anything");
        }
 });
 



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



