//EERST ALLE HELPFUNCTIES DEFINIEEREN
//Script om alle helpfuncties in klakmelding.js op te slaan, voor overzichtelijkheid

function IsNumeric(input)
{
    return (input - 0) == input && (''+input).replace(/^\s+|\s+$/g, "").length > 0;
}

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


//Voorbeeldscript voor Map met mouseover
//TODO:

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
//algemene definitie van de style voor tweets
var image = new ol.style.Circle({
  radius: 5,
  fill: new ol.style.Fill({
    color: 'rgba(30,200,100,0.6)'
  }),
  stroke: new ol.style.Stroke({color: 'green', width: 1})
});

var styles = {
  'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(30,200,100,0.6)'
            }),
            stroke: new ol.style.Stroke({color: 'green', width: 1})
            })
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
//SelectieStyle
var bluePhone = new ol.style.Style({
    image: new ol.style.Icon(({
                            src: 'Klakmelding/telefoon_2.png'
                        }))
});
//Styles voor de verschillende lagen
var styleFunction = function(feature, resolution) {
//      return styles[feature.getGeometry().getType()];
if (feature.get("type")) {
        return styles[feature.get("type")];
    }
    else{ 
        return styles[feature.getGeometry().getType()]; 
    }
};


//definitie stylesKLAK
var stylesKLAK = {
    'Point': [new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'Klakmelding/telefoon.png'
        }))
    })]
};

var styleFunctionKLAK = function(feature, resolution) {
    return stylesKLAK[feature.getGeometry().getType()]; 
};

//Style speciaal voor de selected layer
var styleSelected = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color   : 'rgba(0,0,100,0.6)'
            }),
            stroke: new ol.style.Stroke({color: 'red', width: 3})
            })
    })],
    'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0,20,147,0.8)',
      width: 6
    })
  })]
};

var styleFunctionSelected = function(feature, resolution) {
    return styleSelected[feature.getGeometry().getType()]; 
};

//MS kabel style
var stylesMS = {
  'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(30,50,250,0.6)',
      width: 3
    })
  })]};
var styleFunctionMS = function(feature, resolution) {
    return stylesMS[feature.getGeometry().getType()]; 
};

/////////////////////////////
//Lagen
/////////////////////////////

//Klakmeldingen inladen
var vectorSourceKLAK = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/KLAK.GeoJSON'
});

//Kabels inladen
var vectorSourceKabels = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_LS_Kabels.GeoJSON'
});

//Aansluitingen inladen
var vectorSourceAansl = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/Aansluitingen_inclslim.GeoJSON'
});

var selectedSourceAansl = new ol.source.Vector({
    projection: 'EPSG:3857'
}); 

var selectedSourceKabels = new ol.source.Vector({
    projection: 'EPSG:3857'
}); 

//MS kabels inladen
var vectorSourceKabelsMS = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_MS_kabel_sel.GeoJSON'
});

//MSRen inladen
var vectorSourceMSR = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/NRG_stationsbehuizing_sel.GeoJSON'
});

//Projectie van Kaartlagen

//Klakmeldingen projecteren
var KLAKLayer = new ol.layer.Vector({
    source: vectorSourceKLAK,
    projection: 'EPSG:4326',
    style: styleFunctionKLAK,
    name: 'KLAKLayer'
});
//LS Kabels projecteren
var KabelLayer = new ol.layer.Vector({
    source: vectorSourceKabels,
    projection: 'EPSG:4326',
    style: styleFunction,
    name: 'KabelLayer',
    maxResolution: 3
});

//Aansluitingen projecteren
var AanslLayer = new ol.layer.Vector({
    source: vectorSourceAansl,
    projection: 'EPSG:4326',
    style: styleFunction,
    name: 'AanslLayer',
    maxResolution: 2
});

//MS Kabels projecteren
var KabelLayerMS = new ol.layer.Vector({
    source: vectorSourceKabelsMS,
    projection: 'EPSG:4326',
    style: styleFunctionMS,
    name: 'KabelLayerMS',
    maxResolution: 5
});

//MSRen projecteren
var MSRLayer = new ol.layer.Vector({
    source: vectorSourceMSR,
    projection: 'EPSG:4326',
    style: styleFunction,
    name: 'MSRLayer',
    maxResolution: 5
});

//Geselecteerde aansluitingen
var selectedLayerKabels = new ol.layer.Vector({
    source: selectedSourceKabels,
    style: styleFunctionSelected,
    name: "selectedLayerKabels"
});

var selectedLayerAansl = new ol.layer.Vector({
    source: selectedSourceAansl,
    style: styleFunctionSelected,
    name: "selectedLayerAansl"
});

var raster = new ol.layer.Tile({
      source: new ol.source.MapQuest({layer: 'osm'})
}); 

var map = new ol.Map({
    target: 'map',
    layers: [raster, KabelLayer, AanslLayer, KLAKLayer, selectedLayerAansl, selectedLayerKabels, KabelLayerMS, MSRLayer],
    view: view,
    controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
    collapsible: false
    })
  }),
});

//Stuk hieronder is voor de tooltips
var info = $('#info');
info.tooltip({
    animation: false,
    trigger: 'manual',
    options: {
        content: function() {
            return $(this).attr('title');
        }
    }
});

var displayFeatureInfo_MouseOver = function(pixel) {
  info.css({
    left: (pixel[0] + 10) + 'px',
    top: (pixel[1]) + 'px'
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
    } else if (featureInfo[1].get("name") == "selectedLayerKabels") {
        info.attr('data-original-title', ["KABEL AAN AANSLUITING" + "\n" + "Hoofdleiding NR: " + featureInfo[0].get('HOOFDLEIDING') + "\n" + "Uitvoering: " + featureInfo[0].get('UITVOERING_SCHETS') + "\n" +  "Lengte: " + featureInfo[0].get('LIGGING_Length')])
        info.tooltip('fixTitle')
        info.tooltip('show');
    } else if (featureInfo[1].get("name") == "selectedLayerAansl") {
        info.attr('data-original-title', ["AANSLUITING AAN ZELFDE KABEL" + "\n" + "EAN Code: " + featureInfo[0].get('EAN') + "\n" + "Adres: " + featureInfo[0].get('ARI_ADRES') + "\n" +  "Nominale Capaciteit " + featureInfo[0].get('NOMINALE_CAPACITEIT') + "\n" + "Slimme Meter?: " + featureInfo[0].get('SlimmeMeter')])
        info.tooltip('fixTitle')
        info.tooltip('show');
    }
     else if (featureInfo[1].get("name") == "MSRLayer") {
        info.attr('data-original-title', ["MSR" + "\n" + "Nummer behuizing: " + featureInfo[0].get('NUMMER_BEHUIZING') + "\n" + "Aparte Looproute: " + featureInfo[0].get('LOOPROUTE_RIJROUTE') + "\n" +  "Straatnaam " + featureInfo[0].get('STRAATNAAM') + "\n" + "Sleutelkast?: " + featureInfo[0].get('SLEUTELKASTJE_')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else if (featureInfo[1].get("name") == "KabelLayerMS") {
        info.attr('data-original-title', ["MS Kabel" + "\n" + "MS Hoofdleiding: " + featureInfo[0].get('MS_HLD_ID') + "\n" + "Type Kabel: " + featureInfo[0].get('UITVOERING') + "\n" +  "Toelaatbare Stroom " + featureInfo[0].get('TOELAATBARE_STROOM') + "A"])
        info.tooltip('fixTitle')
        info.tooltip('show');
  }} else {
    info.tooltip('hide');
  }
};

//defineren van een mouseover event
$(map.getViewport()).on('mousemove', function(evt) {
  displayFeatureInfo_MouseOver(map.getEventPixel(evt.originalEvent));
});


//toevoegen van selectiekader
var select = null;
var selectMouseClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    style: bluePhone,
    layers: [KLAKLayer]
});
map.addInteraction(selectMouseClick);

$(map.getViewport()).on('click', function(evt) {
    selectedSourceAansl.clear();
    selectedSourceKabels.clear();
    $('#here_table').empty();
    //Deze onderstaande functie moet anders! De overlay zelf moet worden verwijderd en niet puur en alleen op de map, anders krijgen we een wildgroei aan overlays!
    for(var i=0; i < map.getOverlays().getLength() ; i++){
    map.removeOverlay(map.getOverlays().item(i));
    }
});

function createCircleOutOverlay(position, WelNiet) {
    var elem = document.createElement('div');
    if (WelNiet == 1){
    elem.setAttribute('class', 'circleOutWel');
    } else if (WelNiet == 0){
    elem.setAttribute('class', 'circleOutNiet');
    }
    return new ol.Overlay({
        element: elem,
        position: position,
        positioning: 'center-center'
    });
}

// Handle visibility control

$(document).ready(function() {    

    $('#toggle-ls-storingen').on('click', function () {
        KLAKLayer.setVisible(!KLAKLayer.getVisible());
    });
    
    $("#toggle-klic-werkzaamheden").on('click', function() {
        KlicLayer.setVisible(!KlicLayer.getVisible()); 
     });
    
    $("#toggle-ls-aansl").on('click', function() {
        AanslLayer.setVisible(!AanslLayer.getVisible());
    });
    
    $("#toggle-ls-kabels").on('click', function() {
        KabelLayer.setVisible(!KabelLayer.getVisible());
    });
    
    $("#toggle-ms-kabels").on('click', function() {
        KabelLayerMS.setVisible(!KabelLayerMS.getVisible());
    });
    
    $("#toggle-ls-aansl").on('click', function() {
        MSRLayer.setVisible(!MSRLayer.getVisible());
    });
    
    $("#ping-sm-afstand").on('click', function(){
        if(selectMouseClick) {
            var Afstand = prompt("Ping binnen welke afstand van de geselecteerde KLAK melding? (km)", 3);
            if(IsNumeric(Afstand)){
                var x = selectMouseClick.getFeatures().item(0).getGeometry().getExtent()[0];
                var y = selectMouseClick.getFeatures().item(0).getGeometry().getExtent()[1];
                var NumAfstand = 1000*Number(Afstand); //Afstand moet hier in meter worden gegeven
                var extent = [x-NumAfstand, y-NumAfstand, x+NumAfstand, y+NumAfstand];
//                var FocalFeature = selectMouseClick.getFeatures().item(0);
                AanslLayer.getSource().forEachFeatureInExtent(extent, function(feature) {
                    if (feature.get("SlimmeMeter") == 1){
                                if (feature.get("PingTerug") == 1){
                                    var coordinates = feature.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 1);
                                    map.addOverlay(overlay);
                                } else if (feature.get("PingTerug") == 0){
                                    var coordinates = feature.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 0);
                                    map.addOverlay(overlay);
                                }
                            }
                        });
            } else {
                window.alert("Voer een getal in!");
            } 
            } else {
            window.alert("Selecteer eerst een KLAK melding");
        }
    });
    
    $("#klak-naar-monteur").on('click', function(){
       if(selectMouseClick) {
           var ExtentArray = [];
           var FeatureArray = [];
           for (var i=0; i< selectMouseClick.getFeatures().getLength(); i++) {
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(i);
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
               //Find corresponding name in other layer
                    for (var i=0; i < vectorSourceAansl.getFeatures().length; i++) {
                
                        var feature = vectorSourceAansl.getFeatures()[i];
                        if (feature.get("ARI_ADRES") == ARI) {
                            var HLD_tevinden = feature.get("HOOFDLEIDING");
                            //Array om de maximale extent te bepalen en waar de zoom uiteindelijk heenmoet
                            for (var j=0; j< vectorSourceKabels.getFeatures().length; j++) {
                    
                                var KabelID = vectorSourceKabels.getFeatures()[j];
                                if (KabelID.get("HOOFDLEIDING") == HLD_tevinden){
        //                            KabelID.set("type", "LineStringSelected");
                                    ExtentArray.push(KabelID.getGeometry().getExtent());
                                    FeatureArray.push(KabelID);                            
                                }
                            }
                            break;
                        }
                    }
            }
           if (ExtentArray.length != 0) {
               selectedSourceKabels.addFeatures(FeatureArray);
               var pan = ol.animation.pan({
                   duration: 1000,
                   source: /** @type {ol.Coordinate} */ (view.getCenter())
               });
               map.beforeRender(pan);
               var NewExtent = maxExtent(ExtentArray);
               map.getView().fitExtent(NewExtent, map.getSize());
            }
           //Alle features zijn nu geselecteerd en er moet een nieuwe window worden geopend waarin alle informatie staat die kan worden verstuurd naar de monteur, hierin moet staan 1. Screenshot van storing, 2. alle informatie van de klanten die moet worden meeegegeven 3. Informatie over kabels&MSRen die moet worden meegegeven
           var MonteurWindow = window.open("", "MonteurWindow");
           //Plaatje toevoegen (als dit werkt)
           //MonteurWindow.innerHTML = ;
           //Vervolgens informatie over geselecteerde KLAK meldingen weergeven
           MonteurWindow.document.write("<div id='monteur_info_tabel'></div>");
           var InfoMonteurTabel = MonteurWindow.document.getElementById('monteur_info_tabel');
           var content = "<table>"
           content += "<tr><td><b>KLAK Melding </b></td></tr>"
           content += "<tr><td><b>Naam Klant</td><td><b>Adres Klant</td><td><b>Telefoonnr. Klant</b></td></tr>"
           for(var i=0; i < selectMouseClick.getFeatures().getLength(); i++){
               var NaamMelder = selectMouseClick.getFeatures().item(i).get("Klant");
               var AdresMelder = selectMouseClick.getFeatures().item(i).get("STRAAT") + ' ' +  selectMouseClick.getFeatures().item(i).get("NR");
               content += "<tr><td> " + NaamMelder + " </td><td> " + AdresMelder + " </td><td> Onbekend </td></tr>";
           }
           //Nu voor alle kabels, dit kan via de FeatureArray waarin de kabel features in zijn opgeslagen
           content += "<tr><td><b>Hoofdleiding Nummer</td><td><b>Uitvoering</td><td><b>Lengte</td></b></tr>" 
           for(var i = 0; i < FeatureArray.length; i++){
               var KabelHld = FeatureArray[i].get("HOOFDLEIDING");
               var KabelUitv = FeatureArray[i].get("UITVOERING_SCHETS"); 
               var KabelLengte = FeatureArray[i].get("LIGGING_Length"); 
               content += "<tr><td> " + KabelHld + " </td><td> " + KabelUitv + " </td><td> " +  KabelLengte + " </td></tr>";
           }
           content += "</table>"
           InfoMonteurTabel.innerHTML = content;
        } else {
            window.alert("Selecteer eerst een of meerdere KLAK meldingen");
        }
    });
      
    //Achterliggende kabel tonen
    $('#toon-achterl-kabel').on('click', function(){
        if(selectMouseClick) {
            var ExtentArray = [];
            var FeatureArray = [];
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
    //            window.alert(ARI);
                //Find corresponding name in other layer
                for (var i=0; i < vectorSourceAansl.getFeatures().length; i++) {

                    var feature = vectorSourceAansl.getFeatures()[i];
                    if (feature.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = feature.get("HOOFDLEIDING");
                        //Array om de maximale extent te bepalen en waar de zoom uiteindelijk heenmoet
                        for (var j=0; j< vectorSourceKabels.getFeatures().length; j++) {

                            var KabelID = vectorSourceKabels.getFeatures()[j];
                            if (KabelID.get("HOOFDLEIDING") == HLD_tevinden){
    //                            KabelID.set("type", "LineStringSelected");
                                ExtentArray.push(KabelID.getGeometry().getExtent());
                                FeatureArray.push(KabelID);                            
                            }
    //                        else {
    //                            KabelID.set("type", "LineString");
    //                        }
                        }
                        break;
                    } 
    //                    else {
    //                    feature.set("type", "Point");
    //                }
                }
            }
            if (ExtentArray.length != 0) {
            selectedSourceKabels.addFeatures(FeatureArray);
            var pan = ol.animation.pan({
                duration: 1000,
                source: /** @type {ol.Coordinate} */ (view.getCenter())
            });
            map.beforeRender(pan);
            var NewExtent = maxExtent(ExtentArray);
            map.getView().fitExtent(NewExtent, map.getSize());
            }
        } else {
         window.alert("U heeft niets geselecteerd");
        }
    });
    
    //Achterliggende aansluitingen tonen
    $('#toon-aansl-aan-kabel').on('click', function(){
        if(selectMouseClick) {
            var ExtentArray = [];
            var FeatureArray = [];
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
    //            window.alert(ARI);
                //Find corresponding name in other layer
                for (var i=0; i < vectorSourceAansl.getFeatures().length; i++) {

                    var feature = vectorSourceAansl.getFeatures()[i];
                    if (feature.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = feature.get("HOOFDLEIDING");
                        //Array om de maximale extent te bepalen en waar de zoom uiteindelijk heenmoet
                        for (var j=0; j< vectorSourceAansl.getFeatures().length; j++) {

                            var AanslID = vectorSourceAansl.getFeatures()[j];
                            if (AanslID.get("HOOFDLEIDING") == HLD_tevinden){
                                ExtentArray.push(AanslID.getGeometry().getExtent());
                                FeatureArray.push(AanslID);
                            }
                        }
                        break;
                        }
                    } 
                }
                if (ExtentArray.length != 0) {
                selectedSourceAansl.addFeatures(FeatureArray);
                var pan = ol.animation.pan({
                    duration: 1000,
                    source: /** @type {ol.Coordinate} */ (view.getCenter())
                });
                map.beforeRender(pan);
                var NewExtent = maxExtent(ExtentArray);
                map.getView().fitExtent(NewExtent, map.getSize());

                //Vervolgens informatie toevoegen op basis van de gegevens
                var content = "<table>"
                content += '<tr><td>' + 'Aantal Aansluitingen </td><td>' +  ExtentArray.length + '</td></tr>';
                content += '<tr><td>' + 'Aantal met slimme meter </td><td> ' +  'Nog onbekend' + '</td></tr>';
                content += '<tr><td>' + 'Hoofdleidingnummer </td><td>' +  HLD_tevinden + '</td></tr>';
                content += "</table>"
                $('#here_table').append(content);   
            }
        } else {
         window.alert("You have not selected anything");
        }
    });
    
    $('#Help').on('click', function(){
        window.alert("Help is on it's way! Mis je wat? Vul dan de vragenlijst in of mail je opmerking naar tim.lucas@alliander.com of auke.akkerman@alliander.com");
        });

    //Slimme meters "pingen"
    $('#ping-sm-aan-kabel').on('click', function(){
        if(selectMouseClick) {
            var SMArray = []
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
                //Find corresponding name in other layer
                for (var i=0; i < vectorSourceAansl.getFeatures().length; i++) {

                    var feature = vectorSourceAansl.getFeatures()[i];
                    if (feature.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = feature.get("HOOFDLEIDING");
                        //Array om de maximale extent te bepalen en waar de zoom uiteindelijk heenmoet
                        for (var j=0; j< vectorSourceAansl.getFeatures().length; j++) {

                            var AanslID = vectorSourceAansl.getFeatures()[j];
                            if (AanslID.get("HOOFDLEIDING") == HLD_tevinden && AanslID.get("SlimmeMeter") == 1){
                                SMArray.push(j);
                                if (AanslID.get("PingTerug") == 1){
                                    var coordinates = AanslID.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 1);
                                    map.addOverlay(overlay);
                                } else if (AanslID.get("PingTerug") == 0){
                                    var coordinates = AanslID.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 0);
                                    map.addOverlay(overlay);
                                }

                            }
                        }
                        if (SMArray.length == 0) {
                            window.alert("Geen Slimme Meter op de kabel!")
                        }
                        break;
                    } 
                }
            }
        } else {
         window.alert("You have not selected anything");
        }
    });
}); 

//download PNG module
var exportPNGElement = document.getElementById('export-png');

if ('download' in exportPNGElement) {
  exportPNGElement.addEventListener('click', function(e) {
    map.once('postcompose', function(event) {
      var canvas = event.context.canvas;
      exportPNGElement.href = canvas.toDataURL('image/png');
    });
    map.renderSync();
  }, false);
} else {
    alert('werkt niet gek')
 /* var info = document.getElementById('no-download');
  *
   * display error message
   
  info.style.display = '';*/
}

