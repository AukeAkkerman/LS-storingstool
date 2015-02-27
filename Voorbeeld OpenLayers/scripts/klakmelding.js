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

function addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}

function myTimer() {
    var d = historyslidervalue;
    if (previoushistoryslidervalue[0]!=d[0] || previoushistoryslidervalue[1]!=d[1])
    {
        previoushistoryslidervalue=d;
        map.updateSize()
    }
    currentzoomlevel=map.getView().getZoom();
    if (currentzoomlevel>12)
    {
        currentclusterdistance=0;
    }
    else
    {
        if (currentzoomlevel<10)
        {
            currentclusterdistance=32;
        }
        else
        {
            currentclusterdistance=16;
        }
    }
    
}

function isCluster(feature) {
  if (!feature || !feature.get('features')) { return false; }
  return feature.get('features').length > 1;
}


function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};
 
  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

//Voorbeeldscript voor Map met mouseover
//TODO:

//keep track of KLAK history slider values and related values
var historyslidervalue=[-31,0];
var previoushistoryslidervalue=[-31,0];
var currentzoomlevel=100;
var currentclusterdistance=10;

var projection = ol.proj.get('EPSG:3857');

var Alkmaar = ol.proj.transform([4.75355239868168, 52.62976657605367], 'EPSG:4326', 'EPSG:3857');

//Projectie definiëren voor 
proj4.defs("EPSG:28992","+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=mm +no_defs");
var projectionNL = ol.proj.get('EPSG:28992');
projectionNL.setExtent([646.36, 308975.28, 276050.82, 636456.31]);

var view = new ol.View({
    center: Alkmaar,
    zoom: 11,
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
      color: 'rgba(200,50,50,0.8)',
      width: 2
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


//MSO lokatie style
var MSOstyles = {
  'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
                color: 'rgba(0,0,0,0.6)'
            }),
            stroke: new ol.style.Stroke({color: 'green', width: 1})
            })
    })]
};
var MSOStylesFunction = function(feature, resolution) {
    return MSOstyles[feature.getGeometry().getType()]; 
};

//SelectieStyle

var bluePhone = new ol.style.Style({
    image: new ol.style.RegularShape(
        /** @type {olx.style.RegularShapeOptions} */({
          fill: new ol.style.Fill({color: 'orange'}),
          stroke: new ol.style.Stroke({color: 'black', width: 1}),
          points: 5,
          radius: 10,
          radius2: 4,
          angle: 0
        }))
  });

//var bluePhone = new ol.style.Style({
//    image: new ol.style.Icon(({
//                            src: 'Klakmelding/telefoon_2.png'
//                        }))
//});

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


var stylesClick = {
    'Point': [bluePhone],
    'Polygon': [new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          lineDash: [4],
          width: 3
        })
    })]
};

styleFunctionClick = function(feature, resolution) {
    return stylesClick[feature.getGeometry().getType()]; 
};

var styleFunctionPC4 = function(feature, resolution) {
    
    var TextInhoud = feature.get('PC4CODE') + '\n ' + feature.get('PC4NAAM');
    if(map.getView().getZoom() >=13) {
        TextInhoud = feature.get('PC4CODE') + '\n ' + feature.get('PC4NAAM');
    } else if (map.getView().getZoom() < 13 && map.getView().getZoom() >= 10) {
        TextInhoud = feature.get('PC4CODE');
    } else if (map.getView().getZoom() < 10) {
        TextInhoud = '';
    }

    return [new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.05)'
        }),
        text: new ol.style.Text({
            text: TextInhoud, 
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 1)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 1)',
                width: 1
            })
        })
  })]; 
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

//definitie stylesKLAKHistory
var stylesKLAKHistory = {
    'Point': [new ol.style.Style({
        image: new ol.style.Icon(({
            src: 'Klakmelding/telefoon_grijs.png'
        }))
    })]
};

var stylesKLAKHistoryInvisible = {
    'Point': [new ol.style.Style({
        visible: false
    })]
};

var stylesFunctionKLAKHistory = function(feature, resolution) {
    //return stylesKLAKHistory[feature.getGeometry().getType()]; 
    
    var parts  = feature.get('BEGIN_STORING');
    var Klak_BEGIN_STORING = new Date(1995,1,1);
    
    if (typeof parts !== "undefined")  
    {
        parts = parts.split('-');
        if (parts.length > 2)
        {
            var year = parseInt("20"+parts[2]);
            var dt1  = parseInt(parts[0]);
            var mon1 = parseInt(parts[1]);
            Klak_BEGIN_STORING = new Date(year,mon1-1,dt1);
        }

    }
        
    var fromdate = addDays(new Date(2014,12,31),historyslidervalue[0]);
    var todate = addDays(new Date(2014,12,31),historyslidervalue[1]);
        
    if (Klak_BEGIN_STORING >= fromdate && Klak_BEGIN_STORING <= todate)
    {
        return stylesKLAKHistory[feature.getGeometry().getType()]; 
    }
    else
    {
        return stylesKLAKHistoryInvisible[feature.getGeometry().getType()]; 
    }

};

//Style speciaal voor de selected layer
var styleSelected = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color   : 'rgba(250,0,50,0.7)'
            }),
            stroke: new ol.style.Stroke({color: 'red', width: 1})
            })
    })],
    'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      width: 6
    })
  })],
      'MultiLineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      width: 6
    })
  })],
  'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(250,165,0,0.6)'
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

// OVL style
var stylesOVL = {
'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 4,
            fill: new ol.style.Fill({
                color   : 'rgba(200,210,210,0.1)'
            }),
            stroke: new ol.style.Stroke({color: 'green', width: 1})
            })
    })]
};
var styleFunctionOVL = function(feature, resolution) {
    return stylesOVL[feature.getGeometry().getType()]; 
};

// Mof style
var stylesMof = {
'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            fill: new ol.style.Fill({
                color   : 'rgba(200,50,50,0.8)'
            }),
            stroke: new ol.style.Stroke({color: 'rgba(200,50,50,1)', width: 1})
            })
    })]
};
var styleFunctionMof = function(feature, resolution) {
    return stylesMof[feature.getGeometry().getType()]; 
};

// KLIC layer style
var stylesKLIC = {
   'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color   : 'rgba(250,0,50,0.7)'
            }),
            stroke: new ol.style.Stroke({color: 'red', width: 1})
            })
    })],
    'LineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      width: 6
    })
  })],
      'MultiLineString': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      width: 6
    })
  })],    
'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(80, 60, 50, 1)',
      lineDash: [4],
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(80, 60, 50, 0.8)'
    })
  })]
};
var styleFunctionKLIC = function(feature, resolution) {
    return stylesKLIC[feature.getGeometry().getType()]; 
};


/*// Werkorder style
var stylesWerkorder = {
  'Polygon': [new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(250,165,0,0.6)',
      lineDash: [4],
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(250,80,0,0.4)'
    })
  })]
};
var styleFunctionWerkorder = function(feature, resolution) {
    return stylesWerkorder[feature.getGeometry().getType()]; 
};*/

/////////////////////////////
//Lagen
/////////////////////////////

//Klakmeldingen inladen
var vectorSourceKLAK = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    defaultProjection: 'EPSG:28992',
    url: 'data/KLAK_scenarios.GeoJSON'
});

//Klakmeldingen history 2014 inladen
var vectorSourceKLAKHistory = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    defaultProjection: 'EPSG:4326',
    url: 'data/LS_KLAK_2014_new.GeoJSON',
    strategy: 'ol.Strategy.Box'
});

var clusterSourceKLAKHistory = new ol.source.Cluster({
  //distance: 3,
    distance: currentclusterdistance,
    source: vectorSourceKLAKHistory,
});

var styleCache = {};
var KLAKLayerHistory = new ol.layer.Vector({
  visible: false,
    name: KLAKLayerHistory,
  source: clusterSourceKLAKHistory,
  style: function(feature, resolution) {
    var size = feature.get('features').length;
      
    
      
    var ft =   feature.get('features');
    var fvis = false;
    var filteredsize = 0;
    
    for (index = 0; index < ft.length; ++index) 
    {
        //console.log(a[index]);
        var parts  = ft[index].get('BEGIN_STORING');
        var Klak_BEGIN_STORING = new Date(1995,1,1);

        if (typeof parts !== "undefined")  
        {
            parts = parts.split('-');
            if (parts.length > 2)
            {
                var year = parseInt("20"+parts[2]);
                var dt1  = parseInt(parts[0]);
                var mon1 = parseInt(parts[1]);
                Klak_BEGIN_STORING = new Date(year,mon1-1,dt1);
            }

        }

        var fromdate = addDays(new Date(2015,0,31),historyslidervalue[0]);
        var todate = addDays(new Date(2015,0,31),historyslidervalue[1]);

        if (Klak_BEGIN_STORING >= fromdate && Klak_BEGIN_STORING <= todate)
        {
            fvis = true;
            filteredsize=filteredsize+1;
        }

    }
      
         
    var style = styleCache[filteredsize];
    
        if (filteredsize>=1)
        {
            if (filteredsize>1) 
            {
                if (!style) {
                    style = [new ol.style.Style({
                    image: new ol.style.Icon(({
                    src: 'Klakmelding/telefoon_grijs.png'
                    })),
                      /*
                    image: new ol.style.Circle({
                      radius: 10,
                      stroke: new ol.style.Stroke({
                        color: '#fff'
                      }),
                      fill: new ol.style.Fill({
                        color: '#3399CC'
                      })
                    }),
                      */
                    text: new ol.style.Text({
                      text: filteredsize.toString(),
                      fill: new ol.style.Fill({
                        color: '#fff'
                      })
                    })
                  })];
                  styleCache[filteredsize] = style;
                }

                return style;
                
            }
            else
            {
                 if (!style) {
                    style = [new ol.style.Style({
                    image: new ol.style.Icon(({
                    src: 'Klakmelding/telefoon_grijs.png'
                    }))
                  })];
                  styleCache[filteredsize] = style;
                }
                return style;
            }
        } 
        else
        {
            return stylesKLAKHistoryInvisible;
            //style = stylesKLAKHistoryInvisible;
            //styleCache[size] = style;
        }
    
    return style;
  }
});

//script om live KLAK data op te halen

var vectorSourceliveKLAK = new ol.source.Vector({
    projection: 'EPSG:3857'
});   
 
var KLAKdata;
var Ycor;
var Xcor;
var liveKLAK;
var i;
var discipline1 = "Elektrisch";
var discipline2 = "";
var urgentie1 = "US";
var urgentie2 = "";
liveKLAKreload();

    $('#toggle-elektrisch').on('click', function () {
        KLAKLayer.setVisible(!KLAKLayer.getVisible());
        if ($('#toggle-elektrisch').is(":checked") == true) {discipline1 = "Elektrisch"} else {discipline1 = ""}
        liveKLAKreload();
    });

     $('#toggle-gas').on('click', function () { 
        if ($('#toggle-gas').is(":checked") == true) {discipline2 = "Gas"} else {discipline2 = ""}
        liveKLAKreload();
     });         

     $('#toggle-US-ZUS').on('click', function () {
        if ($('#toggle-US-ZUS').is(":checked") == true) {urgentie1 = "US"} else {urgentie1 = ""}
        liveKLAKreload();
     }); 

     $('#toggle-NUS').on('click', function () {    
        if ($('#toggle-NUS').is(":checked") == true) {urgentie2 = "NUS"} else {urgentie2 = ""}
        liveKLAKreload();
     }); 


function liveKLAKreload(){

        vectorSourceliveKLAK.clear();
$.ajax({
    type: "GET",
    url: 'http://sa0107/cachedworkordersservice/api/workorder',
    dataType: "json",
    success: function(data){
    
        // als de JSON data ophaal actie een succes is, wordt er een loop ingezet   
        KLAKdata = data;
        
        for (i=0; i< KLAKdata.WorkOrders.length; i++){
        if ((KLAKdata.WorkOrders[i].Type == discipline1 ||KLAKdata.WorkOrders[i].Type == discipline2)  && (KLAKdata.WorkOrders[i].Urgency == urgentie1 || KLAKdata.WorkOrders[i].Urgency == urgentie2) ) {   
        
        Xcor = KLAKdata.WorkOrders[i].X;
        Ycor = KLAKdata.WorkOrders[i].Y;    
    
        liveKLAK = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([Number(Xcor), Number(Ycor)], 'EPSG:28992', 'EPSG:3857')),
            Street: KLAKdata.WorkOrders[i].Street,
            StreetNumber: KLAKdata.WorkOrders[i].StreetNumber,  
            StreetNumberAppendix: KLAKdata.WorkOrders[i].StreetNumberAppendix,
            Municipality: KLAKdata.WorkOrders[i].Municipality,
            City: KLAKdata.WorkOrders[i].City,
            Id: KLAKdata.WorkOrders[i].Id,
            WoNumber: KLAKdata.WorkOrders[i].WoNumber,
            Type: KLAKdata.WorkOrders[i].Type,
            TimeArrived: KLAKdata.WorkOrders[i].TimeArrived,
            Description: KLAKdata.WorkOrders[i].Description,
            Status: KLAKdata.WorkOrders[i].Status,
            AreaCode: KLAKdata.WorkOrders[i].AreaCode,
            MechanicCode: KLAKdata.WorkOrders[i].MechanicCode,
            Complaint: KLAKdata.WorkOrders[i].Complaint,
            SubComplaint: KLAKdata.WorkOrders[i].SubComplaint,
            Urgency: KLAKdata.WorkOrders[i].Urgency,
            ProblemType: KLAKdata.WorkOrders[i].ProblemType,
            Appointment: KLAKdata.WorkOrders[i].Appointment,
            AppointmentStartDate: KLAKdata.WorkOrders[i].AppointmentStartDate,
            AppointmentEndDate: KLAKdata.WorkOrders[i].AppointmentEndDate,
            Duties: KLAKdata.WorkOrders[i].Duties,
           // ComplaintDirection: KLAKdata.WorkOrders[i].ComplaintDirection,
            ComplaintCode: KLAKdata.WorkOrders[i].ComplaintCode,
            });

            vectorSourceliveKLAK.addFeatures([liveKLAK]);
        }; }
}
});
};

//LS Kabels inladen
var vectorSourceKabels = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_LS_KABELS.GeoJSON'
});

//LS Aansluitingen inladen
var vectorSourceAansl = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_LS_AANSLUITING.GeoJSON'
});

//LS moffen inladen
var vectorSourceLSMof = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_LS_MOF.GeoJSON'
});

//KLIC meldingen inladen
var vectorSourceKLIC = new ol.source.GeoJSON({
    defaultProjection: projectionNL,
    projection: 'EPSG:3857',
    url: 'data/FCL_KLICMELDINGEN.GeoJSON'
});

//Selectielagen
var selectedSourceAansl = new ol.source.Vector({
    projection: 'EPSG:3857'
}); 

var selectedSourceKabels = new ol.source.Vector({
    projection: 'EPSG:3857'
}); 

var selectedSourceLSMof = new ol.source.Vector({
    projection: 'EPSG:3857'
}); 

//MS kabels inladen
var vectorSourceKabelsMS = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_MS_KABELS.GeoJSON'
});

//MSRen inladen
var vectorSourceMSR = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_STATIONBEHUIZING.GeoJSON'
});

//LS/koppel kasten? lokatie inladen
var vectorSourceMSRLoc = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_STATIONBEHUIZING_(LOCATIE).GeoJSON'
});

//PC4 inladen
var vectorSourcePC4 = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/PC4_gebieden.GeoJSON'
});

//LS OV (openbare verlichting)
var vectorSourceLSOV = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_LS_OV.GeoJSON'
});

/*//LS Kabels inladen
var vectorSourceKabels = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/MV_NRG_LS_KABELS.GeoJSON'
});*/

/*//Werkorders alkmaar inladen
var vectorSourceWerkorders = new ol.source.GeoJSON({
    projection: 'EPSG:3857',
    url: 'data/WERKORDERS_ALKMAAR.GeoJSON'
});*/


//Projectie van Kaartlagen

//Klakmeldingen projecteren
var KLAKLayer = new ol.layer.Vector({
    source: vectorSourceKLAK,
    projection: 'EPSG:4326',
    style: styleFunctionKLAK,
    name: 'KLAKLayer'
});
/*
//Werkorders projecteren
var WerkorderLayer = new ol.layer.Vector({
    source: vectorSourceWerkorders,
    projection: 'EPSG:4326',
    style: stylesWerkorder,
    name: 'WerkorderLayer'
});*/

/*
//Klakmeldingen history projecteren
var KLAKLayerHistory = new ol.layer.Vector({
    source: vectorSourceKLAKHistory,
    projection: 'EPSG:4326',
    //strategies: [new ol.layer.Strategy.Fixed(), filterStrategy],
    style: stylesFunctionKLAKHistory,
    name: 'KLAKLayerHistory',
    visible: false
});
*/

//LS Kabels projecteren
var KabelLayer = new ol.layer.Vector({
    source: vectorSourceKabels,
    projection: 'EPSG:4326',
    style: styleFunction,
    name: 'KabelLayer',
    maxResolution: 1
});

//Aansluitingen projecteren
var AanslLayer = new ol.layer.Vector({
    source: vectorSourceAansl,
    projection: 'EPSG:4326',
    style: styleFunction,
    name: 'AanslLayer',
    maxResolution: 2,

});

//moffen projecteren
var MofLayer = new ol.layer.Vector({
    source: vectorSourceLSMof,
    projection: 'EPSG:4326',
    style: styleFunctionMof,
    name: 'MofLayer',
    maxResolution: 1,
    visible: false
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
    maxResolution: 4
});

//LS- en koppelkasten Lokatie projecteren
var RuimteLocLayer = new ol.layer.Vector({
    source: vectorSourceMSRLoc,
    projection: 'EPSG:4326',
    style: MSOStylesFunction,
    name: 'RuimteLocLayer',
    maxResolution: 5
});


//KLIC layer projecteren
var KLICLayer = new ol.layer.Vector({
    source: vectorSourceKLIC,
    projection: 'EPSG:4326',
    style: styleFunctionKLIC,
    name: 'KLICLayer',
    visible: false
});


//PC4en projecteren
var PC4Layer = new ol.layer.Vector({
    source: vectorSourcePC4,
    projection: 'EPSG:4326',
    style: styleFunctionPC4,
    name: 'PC4_gebieden',
    minResolution: 6

});

//LS OV projecteren
var LSOVLayer = new ol.layer.Vector({
    source: vectorSourceLSOV,
    projection: 'EPSG:4326',
    style: styleFunctionOVL,
    name: 'LS_OV',
    maxResolution: 2
});

//liveKLAK 
var liveKLAKLayer = new ol.layer.Vector({
    source: vectorSourceliveKLAK,
    style: styleFunctionKLAK,
    name: "liveKLAKLayer"
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
    layers: [raster, PC4Layer, KabelLayer, AanslLayer, KLAKLayerHistory, liveKLAKLayer, KLAKLayer, KabelLayerMS, MSRLayer, LSOVLayer, KLICLayer, RuimteLocLayer, MofLayer, selectedLayerAansl, selectedLayerKabels],
    view: view,
    controls: ol.control.defaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
    collapsible: false
    })
  }),
});

//Voor de sidebar

var sidebar = $('#sidebar').sidebar();

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
    left: (pixel[0]) + 'px',
    top: (pixel[1]) + 'px'
  });
  var featureInfo = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
    return [feature, layer];
  });
    if (featureInfo) {
	if (!isCluster(featureInfo[0])) {
		info.tooltip('hide')
		if (featureInfo[1].get("name") == "KLAKLayer") {
			info.attr('data-original-title', ["KLAKMELDING" + "\n" +  "Klantnaam: " + featureInfo[0].get('Klant') + "\n" + "Straatnaam: " + featureInfo[0].get('STRAAT') + " " + featureInfo[0].get('NR') + "\n" +  "Subklacht: " + featureInfo[0].get("Door")])
			info.tooltip('fixTitle')
			info.tooltip('show');
		} else if (featureInfo[1].get("name") == "KLAKLayerHistory") {
			info.attr('data-original-title', ["KLAKMELDING" + "\n" +  "Klak nr: " + featureInfo[0].get('KLAK') + "\n" + "Component: " + featureInfo[0].get('COMPONENT') + "\n" + "Oorzaak: " + featureInfo[0].get('OORZAAK') + "\n" + "Aantal aansl.: "+ featureInfo[0].get('AANT_AANSL') + "\n" + "Monteur: " + featureInfo[0].get("MONTEUR")])
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
	/*    } else if (featureInfo[1].get("name") == "selectedLayerKabels") {
			info.attr('data-original-title', ["KABEL AAN AANSLUITING" + "\n" + "Hoofdleiding NR: " + featureInfo[0].get('HOOFDLEIDING') + "\n" + "Uitvoering: " + featureInfo[0].get('UITVOERING_SCHETS') + "\n" +  "Lengte: " + featureInfo[0].get('LIGGING_Length')])
			info.tooltip('fixTitle')
			info.tooltip('show');*/
		/*} else if (featureInfo[1].get("name") == "selectedLayerAansl") {
			info.attr('data-original-title', ["AANSLUITING AAN ZELFDE KABEL" + "\n" + "EAN Code: " + featureInfo[0].get('EAN') + "\n" + "Adres: " + featureInfo[0].get('ARI_ADRES') + "\n" +  "Nominale Capaciteit " + featureInfo[0].get('NOMINALE_CAPACITEIT') + "\n" + "Slimme Meter?: " + featureInfo[0].get('SlimmeMeter')])
			info.tooltip('fixTitle')
			info.tooltip('show');*/
		}  else if (featureInfo[1].get("name") == "MSRLayer") {
        info.attr('data-original-title', ["MSR" + "\n" + "Nummer behuizing: " + featureInfo[0].get('NUMMER_BEHUIZING') + "\n" + "Aparte Looproute: " + featureInfo[0].get('LOOPROUTE_RIJROUTE') + "\n" +  "Straatnaam " + featureInfo[0].get('STRAATNAAM') + "\n" + "Sleutelkast?: " + featureInfo[0].get('SLEUTELKASTJE_')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else if (featureInfo[1].get("name") == "KabelLayerMS") {
        info.attr('data-original-title', ["MS Kabel" + "\n" + "MS Hoofdleiding: " + featureInfo[0].get('MS_HLD_ID') + "\n" + "Type Kabel: " + featureInfo[0].get('UITVOERING') + "\n" +  "Toelaatbare Stroom " + featureInfo[0].get('TOELAATBARE_STROOM') + "A"])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else if (featureInfo[1].get("name") == "liveKLAKLayer") {
        info.attr('data-original-title', ["KLAK nummer: " + featureInfo[0].get('Id') + "\n" + "Adres: " + featureInfo[0].get('Street') + " " + featureInfo[0].get('StreetNumber') + " " + featureInfo[0].get('StreetNumberAppendix') + "\n" + "Type storing: " + featureInfo[0].get('Type') + "\n" + "Klacht type: " + featureInfo[0].get('Complaint') + "\n" + "Subklacht: " + featureInfo[0].get('SubComplaint') + "\n" + "Status: " + featureInfo[0].get('Status') + "\n" + "Description: " +  featureInfo[0].get('Description')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else if (featureInfo[1].get("name") == "KLICLayer") {
        info.attr('data-original-title', ["KLIC Melding" + "\n" + "Startdatum: " + featureInfo[0].get('DATUMAANVANGWERKZAAMHEDEN') + "\n" + "Einddatum: " + featureInfo[0].get('DATUMEINDWERKZAAMHEDEN') + "\n" +  "Opdrachtgever telnr: " + featureInfo[0].get('OPDRGVR_TELNR') + "\n" +  "Graver: " + featureInfo[0].get('GRAVER_CONTACT')+ "\n" +  "Begeleiders: " + featureInfo[0].get('BEGELEIDERS')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  } else if (featureInfo[1].get("name") == "RuimteLocLayer") {
        info.attr('data-original-title', ["Koppelkast" + "\n" + "Adres: " + featureInfo[0].get('STRAATNAAM') + " " + featureInfo[0].get('HUISNUMMER') + "\n" + "Naam ruimte: " + featureInfo[0].get('NAAM_RUIMTE') + "\n" +  "Nummer behuizing: " + featureInfo[0].get('NUMMER_BEHUIZING') + "\n" +  "Gebouwtoepassing: " + featureInfo[0].get('GEBOUWTOEPASSING')])
        info.tooltip('fixTitle')
        info.tooltip('show');
  }	  else  {
                info.tooltip('hide');
            }} else
      
            // is a cluster, so loop through all the underlying features
            if (true) //(featureInfo[1].get("name") == "KLAKLayerHistory") 
            {
                info.tooltip('hide')
                //KlakLayerHistory
                var features = featureInfo[0].get('features');
                var teksty = "";
                for(var i = 0; i < features.length; i++) 
                {
                // here you'll have access to your normal attributes:
                //console.log(features[0][i].get('name'));
                    teksty = teksty+ "KLAKMELDING" + (i+1) + "\n" +  "Klak nr: " + features[i].get('KLAK') + "\n" +  "BEGIN STORING: " + features[i].get('BEGIN_STORING') + "\n" + "Component: " + features[i].get('COMPONENT') + "\n" + "Oorzaak: " + features[i].get('OORZAAK') + "\n" + "Aantal aansl.: "+ features[i].get('AANT_AANSL') + "\n" + "Monteur: " + features[i].get("MONTEUR")  + "\n" + "\n";
                    
                }
                info.attr('data-original-title', teksty);
                info.tooltip('fixTitle');
                info.tooltip('show');
            }
            else
            {
                info.tooltip('hide');
            }
        } else
            {
                info.tooltip('hide');
            }
};


//toevoegen van selectiekader
var select = null;
var selectMouseClick = new ol.interaction.Select({
    condition: ol.events.condition.click,
    style: styleFunctionClick,
    layers: [KLAKLayer, MSRLayer, AanslLayer, liveKLAKLayer]
});
map.addInteraction(selectMouseClick);



//Deselecteren van onderzochte storing
 $("#deselect-storing").on('click', function() {
//     selectedSourceAansl.clear();
//     selectedSourceKabels.clear();
    selectedSourceAansl.forEachFeature(function(featureSource){
        selectedSourceAansl.removeFeature(featureSource);
    });
    selectedSourceKabels.forEachFeature(function(featureKabel){
        selectedSourceKabels.removeFeature(featureKabel);
    });
//    $('#KlakInfo').empty();
//    $('#example').empty();
    //$('#example').dataTable().fnDestroy();  voor het verwijderen van de DataTabel look, dit werkt nog niet optimaal

//hiden van LS MOffen layer
    MofLayer.setVisible(false); 
     
    //Deze onderstaande functie moet anders! De overlay zelf moet worden verwijderd en niet puur en alleen op de map, anders krijgen we een wildgroei aan overlays!
    for(var i=0; i < map.getOverlays().getLength() ; i++){
    map.removeOverlay(map.getOverlays().item(i));
    }
    sidebar.close()
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


$(document).ready(function() {
    
    function ZoekAdres() {
       var AdresVeld = $("#adreszoeker") 
       $.getJSON('http://nominatim.openstreetmap.org/search?format=json&q=' + AdresVeld.val(), function(data) {
            var FoundExtent = data[0].boundingbox;
            var placemark_lat = data[0].lat;
            var placemark_lon = data[0].lon;

            //boundingbox is voor de extent en de lat en lon zijn voor een marker toe te voegen
            var FoundMarker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([Number(placemark_lon), Number(placemark_lat)], 'EPSG:4326', 'EPSG:3857')),
    name: AdresVeld.value
            });
           selectedSourceAansl.addFeatures([FoundMarker]);

           map.getView().setCenter(ol.proj.transform([Number(placemark_lon), Number(placemark_lat)], 'EPSG:4326', 'EPSG:3857'));

       });
    }
    
    // grey out text of elements that are named 'disabled'
    $( "li" ).each(function() {
        if($(this).find("#disabled").has("[disabled]")){
          $(this).find("#disabled").css("color", "#dadada");
        }
    });
    
    //initialise history slider
    $("#historyslider").slider({tooltip: 'hide'});
    $("#historyslider").on("change", function(slideEvt) {           
                historyslidervalue = slideEvt.value.newValue;
                
                var slidestart;
                if (historyslidervalue[0]==0)
                {
                    slidestart="vandaag";
                }
                else
                {
                    slidestart=historyslidervalue[0]+" dagen geleden";
                }
        
                var slideend;
                if (historyslidervalue[1]==0)
                {
                    slideend="vandaag";
                }
                else
                {
                    slideend=historyslidervalue[1]+" dagen geleden";
                }
        
                var histstart=historyslidervalue[0];
                
                var histend=historyslidervalue[1];
                $("#ex6SliderVal1").text(slidestart);
                $("#ex6SliderVal2").text(slideend);
                
                /*
                map.getLayers().forEach(function(layer) {
                    if (layer.get('name') == 'KLAKLayerhistory') 
                    {
                       
                        var f = new ol.Feature({
                            'i': 1,
                            'size': 20
                        });
                        f.setGeometry( new ol.geom.Point([0,0]) );
                        var features = new Array();
                        features.push(f);
                        
                       
                        //layer.setOpacity(.4);
                        //var sourceold = layer.getSource();
                        //layer.getSource().clear();
                        
                        //layer.setSource(sourceold);
                        //layer.setVisible(!layer.getVisible());
                        
                        map.updateSize()
                        //layer.getVisible()
                    }
                  });
                */
                //map.renderSync();
                //KLAKLayerHistory.render();

        
    });
    
	//start timer function each second
    var myVar=setInterval(function () {myTimer()}, 1000);
	
    //export to CSV functie
    function exportTableToCSV($table, filename) {

        var $rows = $table.find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace('"', '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    }

    // This must be a hyperlink
    $('#export').on('click', function (event) {
        // CSV
        exportTableToCSV.apply(this, [$('#example'), 'export.csv']);
        
        // IF CSV, don't do event.preventDefault() or return false
        // We actually need this to be a typical hyperlink
    });

    
 // Handle visibility control   
//aan en uitzetten van layers

    
    $("#toggle-klic-werkzaamheden").on('click', function() {
        KLICLayer.setVisible(!KLICLayer.getVisible()); 
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
    
    $("#toggle-msr").on('click', function() {
        MSRLayer.setVisible(!MSRLayer.getVisible());
        
    });
    
    $("#toggle-PC4-laag").on('click', function() {
        PC4Layer.setVisible(!PC4Layer.getVisible());
    });    
    
    $("#toggle-1s-kasten").on('click', function() {
        RuimteLocLayer.setVisible(!RuimteLocLayer.getVisible());
    });   
    
    $("#toggle-1s-moffen").on('click', function() {
        MofLayer.setVisible(!MofLayer.getVisible());
    });   

    $("#toggle-1s-OV").on('click', function() {
        LSOVLayer.setVisible(!LSOVLayer.getVisible());
    });   
        
    
    $("#toggle-info-box").change(function(){
        if($('#toggle-info-box').is(':checked')) {
        //defineren van een mouseover event
            $(map.getViewport()).on('mousemove', function(evt) {
                displayFeatureInfo_MouseOver(map.getEventPixel(evt.originalEvent));
            });
        } else {
            $(map.getViewport()).unbind('mousemove');
        }
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
    
    
    //de Gestoorde kabel naar de monteur sturen
    $("#klak-naar-monteur").on('click', function(){
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
                vectorSourceAansl.forEachFeature(function(featureAansl){
                    if (featureAansl.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = featureAansl.get("HOOFDLEIDING");
                        vectorSourceKabels.forEachFeature(function(featureKabel) {
                            if (featureKabel.get("HOOFDLEIDING") == HLD_tevinden){
    //                            KabelID.set("type", "LineStringSelected");
                                ExtentArray.push(featureKabel.getGeometry().getExtent());
                                FeatureArray.push(featureKabel);                            
                            }
                        });
                    } 
                });
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
            var AanslArray = [];
            var SMArray = [];
            var SMOffArray = [];
            var KlakArray = []; 
            var MSRArray = [];
            
            MofLayer.setVisible(!MofLayer.getVisible()); 
            
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                if (selectedFeature.get("Door")){
                    var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";

                    vectorSourceAansl.forEachFeature(function(featureAansl){
                        if (featureAansl.get("ARI_ADRES") == ARI) {
                            var HLD_tevinden = featureAansl.get("HOOFDLEIDING");
                            var MSR_nr_aansl = featureAansl.get("NUMMER_BEHUIZING");
                            vectorSourceKabels.forEachFeature(function(featureKabel) {
                                if (featureKabel.get("HOOFDLEIDING") == HLD_tevinden){
                                    ExtentArray.push(featureKabel.getGeometry().getExtent());
                                    FeatureArray.push(featureKabel);                            
                                }
                            });
                            vectorSourceMSR.forEachFeature(function(featureMSR) {
                                if (featureMSR.get("NUMMER_BEHUIZING") == MSR_nr_aansl){
                                    ExtentArray.push(featureMSR.getGeometry().getExtent());
                                    FeatureArray.push(featureMSR);
                                    MSRArray.push(featureMSR);
                                }
                            });
                            vectorSourceAansl.forEachFeature(function(featureAansl2){
                                if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden){
                                    ExtentArray.push(featureAansl2.getGeometry().getExtent());
                                    FeatureArray.push(featureAansl2);
                                    AanslArray.push(featureAansl2);
                                    
                                if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1){
                                    SMArray.push(featureAansl2);}
                                if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1 &&               featureAansl2.get("PingTerug") != 1) {
                                SMOffArray.push(featureAansl2);}  
                                }
                            });
                            
                        } 
                    });
                } else if (selectedFeature.get("SlimmeMeter")){
                    
                // versie voor het selecteren van een aansluiting    
                var HLD_tevinden = selectedFeature.get("HOOFDLEIDING");
                var MSR_nr_aansl = selectedFeature.get("NUMMER_BEHUIZING");
                vectorSourceKabels.forEachFeature(function(featureKabel) {
                    if (featureKabel.get("HOOFDLEIDING") == HLD_tevinden){
                        ExtentArray.push(featureKabel.getGeometry().getExtent());
                        FeatureArray.push(featureKabel);                            
                    }
                });
                vectorSourceMSR.forEachFeature(function(featureMSR) {
                    if (featureMSR.get("NUMMER_BEHUIZING") == MSR_nr_aansl){
                        ExtentArray.push(featureMSR.getGeometry().getExtent());
                        FeatureArray.push(featureMSR);
                        MSRArray.push(featureMSR);
                    }
                });
                    
                vectorSourceAansl.forEachFeature(function(featureAansl2){
                    if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden){
                    ExtentArray.push(featureAansl2.getGeometry().getExtent());
                    FeatureArray.push(featureAansl2);
                    AanslArray.push(featureAansl2);
                                    
                    if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1){
                        SMArray.push(featureAansl2);}
                    if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1 &&               featureAansl2.get("PingTerug") != 1) {
                        SMOffArray.push(featureAansl2);}                                    

                    }
                    });  
                    
                
            } else {
              window.alert("Selecteer een KLAK melding of een aansluiting");   
            }
            }
            if (ExtentArray.length != 0) {
                selectedSourceKabels.addFeatures(FeatureArray);
                selectedSourceAansl.addFeatures(AanslArray);
                var pan = ol.animation.pan({
                    duration: 1000,
                    source: /** @type {ol.Coordinate} */ (view.getCenter())
                });
                map.beforeRender(pan);
                var NewExtent = maxExtent(ExtentArray);
                map.getView().fitExtent(NewExtent, map.getSize());
                
                // de onderstaande twee blokken worden pas interessant als we de losse belletjes kunnen projecteren op de kaart. Nu nog niet relevant dus even uit geschakeld
/*                //Aantal KLAK meldingen op hoofdleiding
                var KlakArray = [];
                for (var j=0; j< FeatureArray.length; j++) {
                var features = FeatureArray;
                var Aansluiting = features[j];
                var ARI = Aansluiting.get("ARI_ADRES");
            
                vectorSourceKLAK.forEachFeature(function(featureKlak){
                if (featureKlak.get("PC") + featureKlak.get("NR") + " " == ARI) {
                    KlakArray.push(featureKlak);
                }
                });
                 }
                    
                //Percentage kans op LS storing berekenen
             
                if (KlakArray.length > 1){
                var Kans = 0.95;
                } else if(KlakArray.length == 1 && SMArray.length == 0){
                    Kans = 0.5;
                } else if(KlakArray.length == 1 && SMOffArray.length != 0){
                    Kans = 0.5 + 0.5*(1-0.25/SMOffArray.length);
                } else {
                    Kans = 0.5;
                }*/
                
               /* var BehuizingsNR = FeatureArray[1].get("NUMMER_BEHUIZING");
                vectorSourceMSR.forEachFeature(function(featureMSR){
                if (featureMSR.get("NUMMER_BEHUIZING") == BehuizingsNR){
                    MSRArray.push(featureMSR);
                }
                });*/
                
               //Vervolgens informatie toevoegen op basis van de gegevens
                var KlakMeldingInfo = document.getElementById('KlakInfo');
                var content = "<b>Storings analyse</b>"
                content += "<table>"
                //content += '<tr><td>' + 'Aantal KLAK meldingen op kabel </td><td>' +  KlakArray.length + '</td></tr>';
                content += '<tr><td>' + 'Aantal Aansluitingen </td><td>' +  AanslArray.length + '</td></tr>';
                content += '<tr><td>' + 'Aantal met slimme meter </td><td> ' +  SMArray.length + '</td></tr>';
                content += '<tr><td>' + 'Waarvan offline </td><td> ' +  SMOffArray.length + '</td></tr>';
                //content += '<tr><td>' + 'kans op LS storing </td><td> ' +  Kans*100 + ' % </td></tr>';    
                content += '<tr><td>' + 'Hoofdleidingnummer </td><td>' +  FeatureArray[0].get("HOOFDLEIDING") + '</td></tr>';    
                content += "</table>"
                content += "<br>"
                if (MSRArray.length >= 1) {
                content += "<b>Middenspanningsruimte</b>"
                content += "<table>"
                content += '<tr><td>' + 'Ruimtenummer </td><td>' + MSRArray[0].get("NUMMER_BEHUIZING") + '</td></tr>';
                content += '<tr><td>' + 'Lokale naam </td><td>' + MSRArray[0].get("LOKALE_NAAM") + '</td></tr>';
                content += '<tr><td>' + 'Looproute/rijroute </td><td>' + MSRArray[0].get("LOOPROUTE_RIJROUTE") + '</td></tr>';
                content += '<tr><td>' + 'Gebouw toepassing </td><td>' + MSRArray[0].get("GEBOUWTOEPASSING") + '</td></tr>';
                content += '<tr><td>' + 'Eigenaar </td><td>' + MSRArray[0].get("EIGENAAR") + '</td></tr>';
                content += '<tr><td>' + 'Adres ruimte </td><td>' + MSRArray[0].get("STRAATNAAM") + " " + MSRArray[0].get("HUISNUMMER") + '</td></tr>';
                content += '<tr><td>' + 'Sleutelkastje aanwezig? </td><td>' + MSRArray[0].get("SLEUTELKASTJE_") + '</td></tr>';
                content += '</table>'}
                KlakMeldingInfo.innerHTML = content;
                
                //knop om de getroffen klanten weer te geven in een lijst
                $('#getroffenklanten').on("click", function() {
                    LijstKlant();
                });
                
 /*               //Module om een lijst met gestoorde aansluitingen te creeëren en te exporteren
                var InfoGestAans = document.getElementById('example');
                var content = "<table>"
                content += "<thead><tr><td><b>Klantnaam</td><td><b>Functie</td><td><b>ARI adres</td><td><b>Nominale capaciteit</b></td></tr></thead> "
                    
                //Nu voor alle aansluitingen, dit kan via de FeatureArray waarin de aansluiting features in zijn opgeslagen
                for(var i = 0; i < AanslArray.length; i++){
                var Klantnaam = AanslArray[i].get("VolledigeKlantnaam");
                var Functie = AanslArray[i].get("FUNCTIE");    
                var AriAdres = AanslArray[i].get("ARI_ADRES"); 
                var NomCapc = AanslArray[i].get("NOMINALE_CAPACITEIT"); 
   
                content += "<tr><td> " + Klantnaam + " </td><td> " + Functie + " </td><td> " + AriAdres + " </td><td> " +  NomCapc + " </td></tr>";
                }
                content += "</table>"
                content += "<a href='#' class='export' id='export'>Export Table data into Excel</a>"
                InfoGestAans.innerHTML = content;
                
                //opmaak voor de lijst met gestoorde aansluitingen      
                        $('#example').DataTable( {
                                    "scrollCollapse": true,
                                    "autoWidth":      false,
                                    "paging":         true,
                                    "retrieve":        true, 
                                    "order": [[ 2, "desc" ]],
                                    "columnDefs": [ { "width": "30%", "targets": 0 }]
                        });*/
                        //vervolgens de tabbar openen waar de gegevens instaan
                    sidebar.open("storingsgegevens")
            }
        } else {
         window.alert("U heeft niets geselecteerd");
        }
    });


//Aukes versie van de aansluitingen op de kabel en analyse van de KLAK meldingen aan de kabel
   
/*    $('#toon-aansl-aan-kabel').on('click', function(){
        
        if(selectMouseClick) {
            var ExtentArray = [];
            var FeatureArray = [];
            var SMArray = [];
            var SMOffArray = [];
            var KlakArray = []; 
            var MSRArray = [];
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
    //            window.alert(ARI);
                //Find corresponding name in other layer
               vectorSourceAansl.forEachFeature(function(featureAansl){
                    if (featureAansl.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = featureAansl.get("HOOFDLEIDING");
                        //Onderstaande kan waarschijnlijk slimmer omdat ik nu 2 keer dezelfde loop doorloop eigenlijk, nog niet over nagedacht hoe dit wel moet
                            vectorSourceAansl.forEachFeature(function(featureAansl2){
                                if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden){
                                    ExtentArray.push(featureAansl2.getGeometry().getExtent());
                                    FeatureArray.push(featureAansl2);
                                    if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1){
                                    SMArray.push(featureAansl2);}
                                    if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1 &&               featureAansl2.get("PingTerug") != 1) {
                                    SMOffArray.push(featureAansl2);}                                    

                                }
                            });
                        }
                    }); 
                
                }
                if (ExtentArray.length != 0) {
                selectedSourceAansl.addFeatures(FeatureArray);
                var pan = ol.animation.pan({
                    duration: 1000,
                    source:  @type {ol.Coordinate} / (view.getCenter()) // hier de sterretjes weer toevoegen als deze functie weer ingeschakeld wordt
                });
                map.beforeRender(pan);
                var NewExtent = maxExtent(ExtentArray);
                    //Aangezien we een tabel gaan toevoegen wil ik de extent graag wat groter maken
                    for(var k=0; k<NewExtent.length; k++) {
                        if(k == 0 || k == 1){
                            NewExtent[k] *= (1/1.000002);
                        } else {
                            NewExtent[k] *= 1.000002;
                        }
                    }
                map.getView().fitExtent(NewExtent, map.getSize());
// de onderstaande twee blokken worden pas interessant als we de losse belletjes kunnen projecteren op de kaart. Nu nog niet relevant dus even uit geschakeld
                //Aantal KLAK meldingen op hoofdleiding
                var KlakArray = [];
                for (var j=0; j< FeatureArray.length; j++) {
                var features = FeatureArray;
                var Aansluiting = features[j];
                var ARI = Aansluiting.get("ARI_ADRES");
            
                vectorSourceKLAK.forEachFeature(function(featureKlak){
                if (featureKlak.get("PC") + featureKlak.get("NR") + " " == ARI) {
                    KlakArray.push(featureKlak);
                }
                });
                 }
                    
                //Percentage kans op LS storing berekenen
             
                if (KlakArray.length > 1){
                var Kans = 0.95;
                } else if(KlakArray.length == 1 && SMArray.length == 0){
                    Kans = 0.5;
                } else if(KlakArray.length == 1 && SMOffArray.length != 0){
                    Kans = 0.5 + 0.5*(1-0.25/SMOffArray.length);
                } else {
                    Kans = 0.5;
                }
                    
                // MSR informatie erbij zoeken
                    
                var BehuizingsNR = FeatureArray[1].get("NUMMER_BEHUIZING");
                vectorSourceMSR.forEachFeature(function(featureMSR){
                if (featureMSR.get("NUMMER_BEHUIZING") == BehuizingsNR){
                    MSRArray.push(featureMSR);
                }
                });
                    
                    
                //Vervolgens informatie toevoegen op basis van de gegevens
                var KlakMeldingInfo = document.getElementById('KlakInfo');
                var content = "<b>Storings analyse</b>"
                content += "<table>"
                content += '<tr><td>' + 'Aantal KLAK meldingen op kabel </td><td>' +  KlakArray.length + '</td></tr>';
                content += '<tr><td>' + 'Aantal Aansluitingen </td><td>' +  ExtentArray.length + '</td></tr>';
                content += '<tr><td>' + 'Aantal met slimme meter </td><td> ' +  SMArray.length + '</td></tr>';
                content += '<tr><td>' + 'Waarvan offline </td><td> ' +  SMOffArray.length + '</td></tr>';
                content += '<tr><td>' + 'kans op LS storing </td><td> ' +  Kans*100 + ' % </td></tr>';    
                content += '<tr><td>' + 'Hoofdleidingnummer </td><td>' +  FeatureArray[0].get("HOOFDLEIDING") + '</td></tr>';    
                content += "</table>"
                content += "<br>"
                content += "<b>Middenspanningsruimte</b>"
                content += "<table>"
                content += '<tr><td>' + 'Ruimtenummer </td><td>' + BehuizingsNR + '</td></tr>';
                content += '<tr><td>' + 'Lokale naam </td><td>' + MSRArray[0].get("LOKALE_NAAM") + '</td></tr>';
                content += '<tr><td>' + 'Looproute/rijroute </td><td>' + MSRArray[0].get("LOOPROUTE_RIJROUTE") + '</td></tr>';
                content += '<tr><td>' + 'Gebouw toepassing </td><td>' + MSRArray[0].get("GEBOUWTOEPASSING") + '</td></tr>';
                content += '<tr><td>' + 'Eigenaar </td><td>' + MSRArray[0].get("EIGENAAR") + '</td></tr>';
                content += '<tr><td>' + 'Adres ruimte </td><td>' + MSRArray[0].get("STRAATNAAM") + " " + MSRArray[0].get("HUISNUMMER") + '</td></tr>';
                content += '<tr><td>' + 'Sleutelkastje aanwezig? </td><td>' + MSRArray[0].get("SLEUTELKASTJE_") + '</td></tr>';
                content += '</table>'
                KlakMeldingInfo.innerHTML = content;   
                
                
                    
                
                //Module om een lijst met gestoorde aansluitingen te creeëren en te exporteren
                var InfoGestAans = document.getElementById('example');
                var content = "<table>"
                content += "<thead><tr><td><b>EAN</td><td><b>Functie</td><td><b>ARI adres</td><td><b>Nominale capaciteit</b></td></tr></thead> "
                    
                //Nu voor alle aansluitingen, dit kan via de FeatureArray waarin de aansluiting features in zijn opgeslagen
                for(var i = 0; i < FeatureArray.length; i++){
                var EAN = FeatureArray[i].get("EAN");
                var Functie = FeatureArray[i].get("FUNCTIE");    
                var AriAdres = FeatureArray[i].get("ARI_ADRES"); 
                var NomCapc = FeatureArray[i].get("NOMINALE_CAPACITEIT"); 
                content += "<tr><td> " + EAN + " </td><td> " + Functie + " </td><td> " + AriAdres + " </td><td> " +  NomCapc + " </td></tr>";
                }
                content += "</table>"
                content += "<a href='#' class='export' id='export'>Export Table data into Excel</a>"
                InfoGestAans.innerHTML = content;
                
                //opmaak voor de lijst met gestoorde aansluitingen      
                        $('#example').DataTable( {
                                    "scrollCollapse": true,
                                    "autoWidth":      false,
                                    "paging":         true,
                                    "retrieve":        true, 
                                    "order": [[ 2, "desc" ]],
                                    "columnDefs": [ { "width": "30%", "targets": 0 }]
                        });
                        //vervolgens de tabbar openen waar de gegevens instaan
                    sidebar.open("storingsgegevens")
                        } }else {
         window.alert("You have not selected anything");
        }

});
    */
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
                //selectie voor verschillende manieren van aanroepen. Via oude KLAK layer:
                if (selectedFeature.get("Door")){
                var ARI = selectedFeature.get("PC") + selectedFeature.get("NR") + " ";
                //Find corresponding name in other layer
               vectorSourceAansl.forEachFeature(function(featureAansl){
                    if (featureAansl.get("ARI_ADRES") == ARI) {
                        var HLD_tevinden = featureAansl.get("HOOFDLEIDING");
                            vectorSourceAansl.forEachFeature(function(featureAansl2){
                            if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1){
                                SMArray.push(featureAansl2);
                                if (featureAansl2.get("PingTerug") == 1){
                                    var coordinates = featureAansl2.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 1);
                                    map.addOverlay(overlay);
                                } else if (featureAansl2.get("PingTerug") == 0){
                                    var coordinates = featureAansl2.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 0);
                                    map.addOverlay(overlay);
                                }

                            }
                        });
                        if (SMArray.length == 0) {
                            window.alert("Geen Slimme Meter op de kabel!")
                        }
                    } 
                });
                     } else if (selectedFeature.get("SlimmeMeter")){
                            var HLD_tevinden = selectedFeature.get("HOOFDLEIDING");
                            vectorSourceAansl.forEachFeature(function(featureAansl2){
                            if (featureAansl2.get("HOOFDLEIDING") == HLD_tevinden && featureAansl2.get("SlimmeMeter") == 1){
                                SMArray.push(featureAansl2);
                                if (featureAansl2.get("PingTerug") == 1){
                                    var coordinates = featureAansl2.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 1);
                                    map.addOverlay(overlay);
                                } else if (featureAansl2.get("PingTerug") == 0){
                                    var coordinates = featureAansl2.getGeometry().getCoordinates();
                                    var overlay = createCircleOutOverlay(coordinates, 0);
                                    map.addOverlay(overlay);
                                }

                            }
                        }); 
                         if (SMArray.length == 0) {
                            window.alert("Geen Slimme Meter op de kabel!")
                        }
                     }}
        } else {
         window.alert("You have not selected anything");
        }
        });
    
    $('#lijst-gest-aansl').on('click', function(){
        LijstKlant();
    });
    
        function LijstKlant() {
        var content = "";
        var CompensatieWindow = window.open("", "CompensatieWindow", "width=900,height=500");
        CompensatieWindow.document.innerHTML = '';   
                    
                    CompensatieWindow.document.write("<head><title>Lijst getroffen klanten</title><link href='styles/style.css' rel='stylesheet' type='text/css'><link href='http://openlayers.org/en/v3.1.1/css/ol.css' rel='stylesheet' type='text/css'><link href='bootstrap/dist/css/bootstrap.min.css' rel='stylesheet' type='text/css'><link href='bootstrap/dist/css/bootstrap-slider.css' rel='stylesheet' type='text/css'><link href='styles/jquery.dataTables.css' rel='stylesheet' type='text/css'><link href='styles/jquery.dataTables_themeroller.css' rel='stylesheet' type='text/css'><link href='styles/ol3-sidebar.min.css' rel='stylesheet' type='text/css'><link href='http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css' rel='stylesheet'></head>");
                    
                    CompensatieWindow.document.write("<table id='comptab' class='display' cellspacing='0' width=80%>");
                    content += "<thead><tr><td><b>Klantnaam</td><td><b>EAN</td><td><b>Functie</td><td><b>ARI adres</td><td><b>Nominale capaciteit</b></td></tr></thead>"

                    //Nu voor alle aansluitingen, dit kan via de selectedsourceAansl waarin de aansluiting features in zijn opgeslagen
                    for(var i = 0; i < selectedSourceAansl.getFeatures().length; i++){
                    //var TijdKlak = selectedFeature.get("Geregistreerd_op");
                    var Klantnaam = selectedSourceAansl.getFeatures()[i].get("VolledigeKlantnaam");
                    var EAN = selectedSourceAansl.getFeatures()[i].get("EAN");
                    var Functie = selectedSourceAansl.getFeatures()[i].get("FUNCTIE");    
                    var AriAdres = selectedSourceAansl.getFeatures()[i].get("ARI_ADRES"); 
                    var NomCapc = selectedSourceAansl.getFeatures()[i].get("NOMINALE_CAPACITEIT"); 
                    content += "<tr><td> " + Klantnaam + " </td><td> " + EAN + " </td><td> " + Functie + " </td><td> " + AriAdres + " </td><td> " +  NomCapc + " </td></tr>"
                    }
                    content += "</table>"
                    
                    var CompensatieTabel = CompensatieWindow.document.getElementById('comptab');    
                    CompensatieTabel.innerHTML = content;
                    
                    CompensatieWindow.document.write("<script src='scripts/jquery-2.1.3.min.js'></scr" + "ipt></script><script src='scripts/jquery.dataTables.js'></scr" + "ipt><script src='scripts/jquery.dataTables.min.js'></scr" + "ipt>");
        

        //hoe verwijs ik hier naar de tabel die in het nieuw geopende window start?
                    CompensatieWindow.document.write("<script> $('#comptab').DataTable( {'paging': false, 'retrieve': true });</script>" );
                   
        };


    //zoeken van een adres
    $("#zoekadres").on('click', function() {
                       ZoekAdres();
    });
    
    //Onderstaande is voor de adresbalk bovenstaande is voor de knop "zoeken"
    
    $("#adreszoeker").keypress(function (e) {
        //e.which == 13 is de enter knop
       if (e.which == 13){
        ZoekAdres();   
       }
    });
    
    //MSR selecteren en onderliggende aansluitingen weergeven
    $('#MSR-onderliggen-aansl').on('click', function(){
        if(selectMouseClick) {
            var ExtentArray = [];
            var FeatureArray = [];
            for (var k=0; k< selectMouseClick.getFeatures().getLength(); k++) {
                //Haal de naam op van het ARI adres in vectorSourceKLAK (dit is wat geselecteerd is)
                var features = selectMouseClick.getFeatures();
                var selectedFeature = features.item(k);
                var Behuizingsnummer = selectedFeature.get("NUMMER_BEHUIZING");

                //Find corresponding name in other layer
               vectorSourceAansl.forEachFeature(function(featureAansl){
                    if (featureAansl.get("NUMMER_BEHUIZING") == Behuizingsnummer) {
                            ExtentArray.push(featureAansl.getGeometry().getExtent());
                            FeatureArray.push(featureAansl);
                    }
               });
            }
            var KabelArray = [];
            for (var k=0; k<FeatureArray.length; k++){
                KabelArray.push(FeatureArray[k].get("HOOFDLEIDING"));
            }
            //Nu unieke waardes uit de KabelArray halen
            KabelArrayUniek = eliminateDuplicates(KabelArray);
            for (var k=0; k<KabelArrayUniek.length; k++){
                var HoofdleidingNr = KabelArrayUniek[k];
                vectorSourceKabels.forEachFeature(function(featureKabel) {
                    if (featureKabel.get("HOOFDLEIDING") == HoofdleidingNr){
    //                            KabelID.set("type", "LineStringSelected");
                        ExtentArray.push(featureKabel.getGeometry().getExtent());
                        FeatureArray.push(featureKabel);                            
                    }
                });
            }
        if (ExtentArray.length != 0) {
                selectedSourceAansl.addFeatures(FeatureArray);
                var pan = ol.animation.pan({
                    duration: 1000,
                    source: /** @type {ol.Coordinate} */ (view.getCenter())
                });
                map.beforeRender(pan);
                var NewExtent = maxExtent(ExtentArray);
                    //Aangezien we een tabel gaan toevoegen wil ik de extent graag wat groter maken
                    for(var k=0; k<NewExtent.length; k++) {
                        if(k == 0 || k == 1){
                            NewExtent[k] *= (1/1.000002);
                        } else {
                            NewExtent[k] *= 1.000002;
                        }
                    }
                map.getView().fitExtent(NewExtent, map.getSize());
        }} else {  window.alert("You have not selected anything");
    }
    
    sidebar.open("storingsgegevens")
        
    var KlakMeldingInfo = document.getElementById('KlakInfo');
                var content = "<b>MSR analyse</b>"
                content += "<table>"
                content += '<tr><td>' + 'Aantal Aansluitingen </td><td>' +  FeatureArray.length + '</td></tr>';
                content += '<tr><td>' + 'Ruimte nummer </td><td> ' +  Behuizingsnummer + '</td></tr>';
                content += "</table>"  
                 KlakMeldingInfo.innerHTML = content; 
        
    });


    $('#toggle-toon-storingshistorie').on('click', function(){
        
        KLAKLayerHistory.setVisible(!KLAKLayerHistory.getVisible());
        
        if (KLAKLayerHistory.getVisible())
        {
            //vervolgens de tabbar openen waar de gegevens instaan
            sidebar.open("ToggleLagen");
        }
                     
    });

}); 

//download PNG module werkt nog niet
//var exportPNGElement = document.getElementById('export-png');
//
//if ('download' in exportPNGElement) {
//  exportPNGElement.addEventListener('click', function(e) {
//    map.once('postcompose', function(event) {
//      var canvas = event.context.canvas;
//      exportPNGElement.href = canvas.toDataURL('image/png');
//    });
//    map.renderSync();
//  }, false);
//} else {
//    alert('werkt niet gek')
// /* var info = document.getElementById('no-download');
//  *
//   * display error message
//   
//  info.style.display = '';*/
//}



