// ETIQUETAS DE LAS CIUDADES //

viewer.entities.add({
    id: 'Madrid',
    position: Cesium.Cartesian3.fromDegrees(-3.8196207, 40.4378698, 100000.0),
    label: {
        text: 'Madrid',
        translucencyByDistance: new Cesium.NearFarScalar(1.5e5, 1.0, 1.5e7, 0.0)
    }
});

viewer.entities.add({
    id: 'Barcelona',
    position: Cesium.Cartesian3.fromDegrees(2.0787285, 41.3947688, 100000.0),
    label: {
        text: 'Barcelona',
        translucencyByDistance: new Cesium.NearFarScalar(1.5e5, 1.0, 1.5e7, 0.0)
    }
});
