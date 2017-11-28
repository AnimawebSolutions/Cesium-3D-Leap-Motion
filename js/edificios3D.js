// FUNCION CALCULA ALTURAS DE OBJETOS 3D - RELIEVE //
var modelNames;
var terrainPositions;

function sampleTerrainSuccess() {
    var ellipsoid = Cesium.Ellipsoid.WGS84;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.entities.suspendEvents();

    for (var i = 0; i < terrainPositions.length; ++i) {
        var model = modelNames[i];
        var position = terrainPositions[i];
        var entity_obj3D = viewer.entities.add({
            position: ellipsoid.cartographicToCartesian(position),
            shadows: true,
            model: {
                uri: 'obj3D/' + model + '.glb',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 5000)
            }
        });
    }
    viewer.entities.resumeEvents();
}


// CARGAMOS OBJETOS 3D //
function cargaModelos3D(city) {
    $.getJSON("obj3D/" + city + "/00_Config.json", function(Obj3D_JSON) {
        modelNames = [];
        terrainPositions = [];
        $.each(Obj3D_JSON.Obj3D, function(i, item) {
            var model = city + '/' + item.model;
            var longitudeRadians = Cesium.Math.toRadians(item.lng);
            var latitudeRadians = Cesium.Math.toRadians(item.lat);
            var position = new Cesium.Cartographic(longitudeRadians, latitudeRadians);
            terrainPositions.push(position);
            modelNames.push(model);
        });
        Cesium.when(Cesium.sampleTerrain(viewer.terrainProvider, 9, terrainPositions), sampleTerrainSuccess);
    });
}
