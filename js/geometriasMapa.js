// LLAMADA API MADIVA DE GEOMETRIAS //
var colorScale = chroma.scale('RdYlBu').domain([1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

function cargaGeometrias(southWest, northWest, northEast, southEast, idProvince) {
    var madivaApi = apiURL + "getGeometry/" + southWest + "/" + northWest + "/" + northEast + "/" + southEast + "/" + idProvince;
    
    if (testApp === true)
        console.log('LLAMADA A LA API ( getGeometry ) : ' + madivaApi);

    $.getJSON(madivaApi).done(function(dataJSON) {
        geometryOptions = [];
        geometryPositions = [];
        $.each(dataJSON.features, function(i, item) {

            var itemID = item.id;
            var alturaDemo = item.properties.altura;
            var totalVertices = item.geometry.coordinates.length;
            var colorDemo = colorScale(item.properties.altura).hex();

            geometryOptions[i] = [];
            geometryOptions[i].push(itemID, colorDemo, alturaDemo, totalVertices);

            $.each(item.geometry.coordinates, function(x, item2) {
                geometryPositions.push(Cesium.Cartographic.fromDegrees(Number(item2[0]), Number(item2[1])));
            });

        });
        Cesium.when(Cesium.sampleTerrain(viewer.terrainProvider, 9, geometryPositions), geometryTerrainSuccess);
    });
}

function borraGeometrias(southWest, northWest, northEast, southEast, idProvince) {
    var madivaApi = apiURL + "getGeometryDelete/" + southWest + "/" + northWest + "/" + northEast + "/" + southEast + "/" + idProvince;

    if (testApp === true)
        console.log('LLAMADA A LA API ( getGeometryDelete ) : ' + madivaApi);

    $.getJSON(madivaApi).done(function(dataJSON) {
        $.each(dataJSON.deleteItems, function(i, item) {
            if (loadGeometries.indexOf(item.id) != -1) {
                viewer.entities.removeById(item.id);
                loadGeometries.splice(loadGeometries.indexOf(item.id), 1);
                loadGeometriesColor.splice(loadGeometries.indexOf(item.id), 1);
            }
        });
    });
}


// FUNCION CALCULA ALTURAS DE OBJETOS GEOMETRIAS - RELIEVE //
var geometryLayer;
var geometryOptions;
var geometryPositions;
var maxGeometries = 2000;
var loadGeometries = [];
var loadGeometriesColor = [];

function geometryTerrainSuccess() {
    var ellipsoid = Cesium.Ellipsoid.WGS84;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.entities.suspendEvents();

    var init = 0;
    var updatedPositions = [];
    for (var i = 0; i < geometryOptions.length; ++i) {
        updatedPositions = [];

        for (var j = init; j < geometryOptions[i][3] + init; ++j) {
            updatedPositions.push(geometryPositions[j]);
        }
        init = geometryOptions[i][3] + init;

        if (loadGeometries.indexOf(geometryOptions[i][0]) == -1) {

            loadGeometries.push(geometryOptions[i][0]);
            loadGeometriesColor.push(geometryOptions[i][1]);

            geometryLayer = viewer.entities.add({
                id: geometryOptions[i][0],
                polygon: {
                    outline: true,
                    shadows: Cesium.ShadowMode.ENABLED,
                    hierarchy: ellipsoid.cartographicArrayToCartesianArray(updatedPositions),
                    outlineColor: Cesium.Color.fromCssColorString(geometryOptions[i][1]).darken(0.1, new Cesium.Color()),
                    extrudedHeight: Math.floor((geometryOptions[i][2] * 5) + updatedPositions[0].height),
                    material: Cesium.Color.fromCssColorString(geometryOptions[i][1]).withAlpha(1),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000)
                }
            });
        }

    }

    if (loadGeometries.length > maxGeometries) {
        if (testApp === true)
            console.log('... LIBERANDO MEMORIA ( Geometrias ) ...');
        getRectangle('descargaGeometrias');
    }

    viewer.entities.resumeEvents();

    // Cargamos antenas
    getRectangle('cargaAntenas');
}
