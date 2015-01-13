// JavaScript source code
// from https://github.com/DmitryBaranovskiy/raphael

var styles = {
  'amenity': {
    'parking': [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(170, 170, 170, 1.0)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(170, 170, 170, 0.3)'
        })
      })
    ]
  },
  'building': {
    '.*': [
      new ol.style.Style({
        zIndex: 100,
        stroke: new ol.style.Stroke({
          color: 'rgba(246, 99, 79, 1.0)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(246, 99, 79, 0.3)'
        })
      })
    ]
  },
  'highway': {
    'service': [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 1.0)',
          width: 2
        })
      })
    ],
    '.*': [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 1.0)',
          width: 3
        })
      })
    ]
  },
  'landuse': {
    'forest|grass|allotments': [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'rgba(140, 208, 95, 1.0)',
          width: 1
        }),
        fill: new ol.style.Fill({
          color: 'rgba(140, 208, 95, 0.3)'
        })
      })
    ]
  },
  'natural': {
    'tree': [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 2,
          fill: new ol.style.Fill({
            color: 'rgba(140, 208, 95, 1.0)'
          }),
          stroke: null
        })
      })
    ]
  }
};


function bounce(t) {
    var s = 7.5625, p = 2.75, l;
    if (t < (1 / p)) {
        l = s * t * t;
    } else {
        if (t < (2 / p)) {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
        } else {
            if (t < (2.5 / p)) {
                t -= (2.25 / p);
                l = s * t * t + 0.9375;
            } else {
                t -= (2.625 / p);
                l = s * t * t + 0.984375;
            }
        }
    }
    return l;
}

function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

var london = ol.proj.transform([-0.12755, 51.507222], 'EPSG:4326', 'EPSG:3857');
var moscow = ol.proj.transform([37.6178, 55.7517], 'EPSG:4326', 'EPSG:3857');
var istanbul = ol.proj.transform([28.9744, 41.0128], 'EPSG:4326', 'EPSG:3857');
var rome = ol.proj.transform([12.5, 41.9], 'EPSG:4326', 'EPSG:3857');
var bern = ol.proj.transform([7.4458, 46.95], 'EPSG:4326', 'EPSG:3857');
var madrid = ol.proj.transform([-3.683333, 40.4], 'EPSG:4326', 'EPSG:3857');
var amsterdam = ol.proj.transform([4.53, 52.22], 'EPSG:4326', 'EPSG:3857');

var projection = ol.proj.get('EPSG:3857');

var view = new ol.View({
//    center: [876970.8463461736, 5859807.853963373],
//    projection: projection,
//    zoom: 10
    center: amsterdam,
    zoom: 10,
    projection: projection
});

var raster = new ol.layer.Tile({
    source: new ol.source.BingMaps({
        imagerySet: 'Aerial',
        key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3'
    })
});

//var vector = new ol.layer.Vector({
//    source: new ol.source.KML({
//        projection: projection,
//        url: 'Klakmelding/map.kml'
//    })
//});

var vectorSource = new ol.source.ServerVector({
  format: new ol.format.OSMXML(),
  loader: function(extent, resolution, projection) {
    var epsg4326Extent =
        ol.proj.transformExtent(extent, projection, 'EPSG:4326');
    var url = 'http://overpass-api.de/api/xapi?map?bbox=' +
        epsg4326Extent.join(',');
    $.ajax(url).then(function(response) {
      vectorSource.addFeatures(vectorSource.readFeatures(response));
    });
  },
  strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
    maxZoom: 19
  })),
  projection: 'EPSG:3857'
});

var vector = new ol.layer.Vector({
  source: vectorSource,
  style: function(feature, resolution) {
    for (var key in styles) {
      var value = feature.get(key);
      if (value !== undefined) {
        for (var regexp in styles[key]) {
          if (new RegExp(regexp).test(value)) {
            return styles[key][regexp];
          }
        }
      }
    }
    return null;
  }
});

//var map = new ol.Map({
//  layers: [raster, vector],
//  target: document.getElementById('map'),
//  controls: ol.control.defaults({
//    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
//      collapsible: false
//    })
//  }),
//  view: new ol.View({
//    center: [739218, 5906096],
//    maxZoom: 19,
//    zoom: 17
//  })
//});


var map = new ol.Map({
    target: 'map',
    layers: [raster],
    view: view
});

var rotateLeft = document.getElementById('rotate-left');
rotateLeft.addEventListener('click', function () {
    var rotateLeft = ol.animation.rotate({
        duration: 500,
        rotation: -4 * Math.PI
    });
    map.beforeRender(rotateLeft);
}, false);
var rotateRight = document.getElementById('rotate-right');
rotateRight.addEventListener('click', function () {
    var rotateRight = ol.animation.rotate({
        duration: 2000,
        rotation: 2 * Math.PI
    });
    map.beforeRender(rotateRight);
}, false);

var rotateAroundRome = document.getElementById('rotate-around-rome');
rotateAroundRome.addEventListener('click', function () {
    var currentRotation = view.getRotation();
    var rotateAroundRome = ol.animation.rotate({
        anchor: rome,
        duration: 1000,
        rotation: currentRotation
    });
    map.beforeRender(rotateAroundRome);
    view.rotate(currentRotation + (Math.PI / 2), rome);
}, false);

var panToLondon = document.getElementById('pan-to-london');
panToLondon.addEventListener('click', function () {
    var pan = ol.animation.pan({
        duration: 2000,
        source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(london);
}, false);

var elasticToMoscow = document.getElementById('elastic-to-moscow');
elasticToMoscow.addEventListener('click', function () {
    var pan = ol.animation.pan({
        duration: 2000,
        easing: elastic,
        source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(moscow);
}, false);

var bounceToIstanbul = document.getElementById('bounce-to-istanbul');
bounceToIstanbul.addEventListener('click', function () {
    var pan = ol.animation.pan({
        duration: 2000,
        easing: bounce,
        source: /** @type {ol.Coordinate} */ (view.getCenter())
    });
    map.beforeRender(pan);
    view.setCenter(istanbul);
}, false);

var spinToRome = document.getElementById('spin-to-rome');
spinToRome.addEventListener('click', function () {
    var duration = 2000;
    var start = +new Date();
    var pan = ol.animation.pan({
        duration: duration,
        source: /** @type {ol.Coordinate} */ (view.getCenter()),
        start: start
    });
    var rotate = ol.animation.rotate({
        duration: duration,
        rotation: 2 * Math.PI,
        start: start
    });
    map.beforeRender(pan, rotate);
    view.setCenter(rome);
}, false);

var flyToBern = document.getElementById('fly-to-bern');
flyToBern.addEventListener('click', function () {
    var duration = 2000;
    var start = +new Date();
    var pan = ol.animation.pan({
        duration: duration,
        source: /** @type {ol.Coordinate} */ (view.getCenter()),
        start: start
    });
    var bounce = ol.animation.bounce({
        duration: duration,
        resolution: 4 * view.getResolution(),
        start: start
    });
    map.beforeRender(pan, bounce);
    view.setCenter(bern);
}, false);

var spiralToMadrid = document.getElementById('spiral-to-madrid');
spiralToMadrid.addEventListener('click', function () {
    var duration = 2000;
    var start = +new Date();
    var pan = ol.animation.pan({
        duration: duration,
        source: /** @type {ol.Coordinate} */ (view.getCenter()),
        start: start
    });
    var bounce = ol.animation.bounce({
        duration: duration,
        resolution: 2 * view.getResolution(),
        start: start
    });
    var rotate = ol.animation.rotate({
        duration: duration,
        rotation: -4 * Math.PI,
        start: start
    });
    map.beforeRender(pan, bounce, rotate);
    view.setCenter(madrid);
}, false);

var goToAmsterdam = document.getElementById('go-to-amsterdam');
goToAmsterdam.addEventListener('click', function () {
    view.setCenter(amsterdam);
}, false);

