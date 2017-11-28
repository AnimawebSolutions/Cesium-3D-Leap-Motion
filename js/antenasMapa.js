// FUNCION PAR PINTAR LAS ANTENAS //

function cargaAntenas(southWest, northWest, northEast, southEast, idProvince) {
    var madivaApi = apiURL + "getAntennas/" + southWest + "/" + northWest + "/" + northEast + "/" + southEast + "/" + idProvince;

    if (testApp === true)
        console.log('LLAMADA A LA API ( getAntennas ) : ' + madivaApi);

    $.getJSON(madivaApi).done(function(dataJSON) {
        antennasId = [];
        antennasPositions = [];
        $.each(dataJSON, function(i, item) {
            var itemID = item.id;
            var longitudeRadians = Cesium.Math.toRadians(item.lng);
            var latitudeRadians = Cesium.Math.toRadians(item.lat);
            var position = new Cesium.Cartographic(longitudeRadians, latitudeRadians);
            antennasId.push(itemID);
            antennasPositions.push(position);
        });
        Cesium.when(Cesium.sampleTerrain(viewer.terrainProvider, 9, antennasPositions), antennasTerrainSuccess);
    });
}


// FUNCION CALCULA ALTURAS DE ANTENAS  3D - RELIEVE //
var antennasId;
var entity_Antenna;
var antennasPositions;
var maxAntennas = 20;
var loadAntennas = [];

function antennasTerrainSuccess() {
    var ellipsoid = Cesium.Ellipsoid.WGS84;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.entities.suspendEvents();

    for (var i = 0; i < antennasId.length; ++i) {
        var idAntena = "Antena_" + antennasId[i];
        var position = antennasPositions[i];

        if (loadAntennas.indexOf(idAntena) == -1) {

            loadAntennas.push(idAntena);

            entity_Antenna = viewer.entities.add({
                id: idAntena,
                scale: 1.0,
                clickable: true,
                position: ellipsoid.cartographicToCartesian(position),
                shadows: true,
                model: {
                    uri: 'obj3D/COMMON/cellTower.glb'
                }
            });
        }
    }

    if (loadAntennas.length > maxAntennas) {
        if (testApp === true)
            console.log('... LIBERANDO MEMORIA ( Antenas ) ...');
        //getRectangle('descargaAntenas');
    }

    viewer.entities.resumeEvents();
}


// FUNCION PARA CARGAR LA INFORMACION DE LAS ANTENAS //
var selectAntenna;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function(click) {
    var pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && (pickedObject.id._clickable === true) && (selectAntenna != pickedObject.id._id)) {
        selectAntenna = pickedObject.id._id;
        cargarDatosAntena(pickedObject);
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

var arrayRadiusGeometry;

function cargarDatosAntena(pickedObject) {
    var idAntenna = pickedObject.id._id.substring(7);
    var selectAntena = viewer.entities.getById(pickedObject.id._id);
    viewer.trackedEntity = selectAntena;

    var madivaApi = apiURL + "getGeometryAntennas/" + idAntenna;

    if (testApp === true)
        console.log('LLAMADA A LA API ( getGeometryAntennas ) : ' + madivaApi);

    $.getJSON(madivaApi).done(function(dataJSON) {
        arrayRadiusGeometry = dataJSON.dataAntenna.radiusGeometry;
        cargaGraficaAntenna(dataJSON.dataAntenna.actividadAntenna);
    });
}


// FUNCION PARA COLOREAR/ACLARAR GEOMETRIAS ANTENA //
var colorBaseGeometrias = '#158395';

function pintaGeometriasAntena(conections) {
    // viewer.entities.getById(item).polygon.extrudedHeight = Math.floor((20* 10) + 600);
    $.each(loadGeometries, function(i, item) {
        if (arrayRadiusGeometry.indexOf(item) != -1) {
            var red = viewer.entities.getById(item).polygon.material._color._value.red;
            var green = viewer.entities.getById(item).polygon.material._color._value.green;
            var blue = viewer.entities.getById(item).polygon.material._color._value.blue;
            var alpha = conections;
            var newColor = new Cesium.Color(red, green, blue, alpha);
            viewer.entities.getById(item).polygon.material = newColor;
        } else {
            viewer.entities.getById(item).polygon.material = Cesium.Color.fromCssColorString(colorBaseGeometrias).withAlpha(1);
            viewer.entities.getById(item).polygon.outlineColor = Cesium.Color.fromCssColorString(colorBaseGeometrias).darken(conections, new Cesium.Color());
        }
    });
}

function restartGeometriasAntena() {
    $.each(loadGeometries, function(i, item) {
        var restartColor = loadGeometriesColor[loadGeometries.indexOf(item)];
        viewer.entities.getById(item).polygon.material = Cesium.Color.fromCssColorString(restartColor).withAlpha(1);
        viewer.entities.getById(item).polygon.outlineColor = Cesium.Color.fromCssColorString(restartColor).darken(0.1, new Cesium.Color());
    });
}


// FUNCION PARA VISUALIZAR GRAFICA DE LA ANTENA //
$('#closeInfoGraph').bind('click', function() {
    clearInterval(monitorizaAntena);
    selectAntenna = undefined;
    $('#infoGraph').fadeOut();
    restartGeometriasAntena();
    viewer.trackedEntity = undefined;
});

var monitorizaAntena;

function cargaGraficaAntenna(dataAntenna) {

    var minValue = Math.min.apply(null, dataAntenna.map(function(item) {
        return item.value;
    }));

    var maxValue = Math.max.apply(null, dataAntenna.map(function(item) {
        return item.value;
    }));

    var numIni = 5;

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    Highcharts.chart('chartConection', {
        chart: {
            backgroundColor: '#303030',
            type: 'spline',
            animation: Highcharts.svg,
            marginRight: 10,
            events: {
                load: function() {
                    var day = 1;
                    var num = 0;
                    var series = this.series[0];
                    monitorizaAntena = setInterval(function() {
                        num++;
                        if (num < dataAntenna.length) {
                            var valorActual = dataAntenna[num].value;
                            var porcentaje = ((((valorActual * 100) / maxValue) / 10).toFixed()) / 10;
                            pintaGeometriasAntena(porcentaje);
                        } else {
                            num = -1;
                        }

                        if (numIni < dataAntenna.length) {
                            var x = new Date("2017/1/" + day + "/" + dataAntenna[numIni].label);
                            var y = dataAntenna[numIni].value;
                            var newData = {
                                x,
                                y
                            };
                            series.addPoint(newData, true, true);
                            numIni++;
                        } else {
                            day++;
                            numIni = 0;
                        }
                    }, 1000);
                }
            }
        },
        title: '',
        xAxis: {
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            },
            lineColor: '#FFFFFF',
            tickColor: '#FFFFFF',
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            labels: {
                style: {
                    color: '#FFFFFF'
                }
            },
            title: {
                text: 'Total connections',
                style: {
                    color: '#FFFFFF'
                }
            },
            gridLineColor: '#555'
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            formatter: function() {
                return "<b> At " + Highcharts.dateFormat('%H', this.x) + " O'clock</b><br/>" + '<div style="font-size: 40px">' + this.y + "</div><br/>Connections";
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        plotOptions: {
            series: {
                cursor: 'pointer',
                marker: {
                    lineWidth: 1,
                    lineColor: '#FFFFFF'
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Connections',
            data: (function() {
                var data = [];
                for (x = 0; x < numIni; x++) {
                    data.push({
                        x: new Date("2017/1/1/" + dataAntenna[x].label),
                        y: dataAntenna[x].value
                    });
                }
                return data;
            }()),
            color: '#4285F4',
            shadow: {
                color: '#4285F4',
                width: 10,
                offsetX: 0,
                offsetY: 0
            }
        }]
    });

    $('#infoGraph').fadeIn();

    var valorActual = dataAntenna[0].value;
    var porcentaje = ((((valorActual * 100) / maxValue) / 10).toFixed()) / 10;
    pintaGeometriasAntena(porcentaje);
}
