// VARIABLES DEL ENTORNO GENERAL //
var testApp = true;
var apiURL = '//localhost/3d_Map/Cesium/api/';


// MODULOS DE LA LIBRERIA CESIUM MADIVA //
include([
    'js/videosPromo.js',
    'js/pinsMapa.js',
    'js/leapMotion.js',
    'js/antenasMapa.js',
    'js/menuMapa.js',
    'js/etiquetasMapa.js',
    'js/edificios3D.js',
    'js/flytoMap.js',
    'js/geometriasMapa.js',
    'js/listenerMapa.js'
], function() {
    try {
        if (testApp === true)
            console.log('CARGADANGO LIBRERIAS....');

        init();
    } catch (err) {
        console.log('ERROR: ' + err);
    }
});


// FUNCION INICIAL //
function init() {
    cargaModelos3D('MAD');

    if (testApp === true) {
        var stats = new Stats();
        stats.showPanel(1);
        document.body.appendChild(stats.dom);

        function animate() {
            stats.update();
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        $('body').append('<div id="chivatoLeap" style="font-weight:bold; position: absolute; right:50px; top:0px; z-index:5000; width: 300px; height: 100px; background-color:rgba(153, 255, 0, 0.2); color:lime; text-align: center;"></div>');
    }
}


// CONTROL DE LA ESCENA //
var viewer = new Cesium.Viewer('cesiumContainer', {
    infoBox: false,
    shadows: true,
    vrButton: true,
    geocoder: false,
    timeline: false,
    enableLighting: true,
    animation: false,
    navigationHelpButton: false,
    scene3DOnly: true,
    selectionIndicator: false,
    //terrainShadows: Cesium.ShadowMode.ENABLED,
    imageryProvider: new Cesium.createOpenStreetMapImageryProvider({
        //url: 'http://a.basemaps.cartocdn.com/dark_all/'
        url: 'http://a.basemaps.cartocdn.com/light_all/'
            /*url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
            fileExtension: 'jpg'*/
    }),
    baseLayerPicker: false
});


// CONTROL DE LA CAMARA //
var camera = viewer.scene.camera;
viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100.0;


// CONTROL DE SOMBRAS //
var shadowMap = viewer.shadowMap;
shadowMap.size = 2048;
shadowMap.softShadows = true;
shadowMap.maxmimumDistance = 10000.0;


// VARIOS CONTROLES // 
var pinBuilder = new Cesium.PinBuilder();
var cartographic = new Cesium.Cartographic();
var ellipsoid = viewer.scene.mapProjection.ellipsoid;


// CAPAS DEL PROYECTO //
var layers = viewer.imageryLayers;
var capaMundo = layers.addImageryProvider(new Cesium.BingMapsImageryProvider({
    url: '//dev.virtualearth.net'
}));
capaMundo.alpha = 1;


// PARAMETROS DE AMBIENTE //
viewer.scene.fog.enabled = true;
viewer.scene.globe.enableLighting = true;


// RELIEVE DEL TERRENO //
var vrTheWorldProvider = new Cesium.VRTheWorldTerrainProvider({
    url: 'http://www.vr-theworld.com/vr-theworld/tiles1.0.0/73/',
    credit: 'Terrain data courtesy VT MÄK'
});
viewer.terrainProvider = vrTheWorldProvider;


// CONTROLAMOS EL RELOJ //
var newDate = 2457804.958333;
viewer.clock.currentTime = new Cesium.JulianDate(newDate);
viewer.clock.multiplier = 0;


// RECTANGULO DE CARGA RESPECTO AL CENTRO DE LA CAMARA //
function getRectangle(loadType) {

    // Variable del rectangulo de carga
    var idProvince = 28;
    var widthRectangle = 5000;
    var heightRectangle = 4000;

    // Calculamos el centro de la camara
    var windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
    var pickRay = viewer.scene.camera.getPickRay(windowPosition);
    var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
    var pickPositionCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
    var longitudeCenter = pickPositionCartographic.longitude * (180 / Math.PI);
    var latitudeCenter = pickPositionCartographic.latitude * (180 / Math.PI);
    var distanciaX = widthRectangle / 2;
    var distanciaY = heightRectangle / 2;

    // Calculamos rectangulo de la camara a cargar
    var constanteH = 8.993216E-6;
    var yMax = longitudeCenter + (constanteH * (distanciaX * -1)) / Math.cos(latitudeCenter);
    var yMin = longitudeCenter + (constanteH * distanciaX) / Math.cos(latitudeCenter);
    var xMin = latitudeCenter + (constanteH * (distanciaY * -1));
    var xMax = latitudeCenter + (constanteH * distanciaY);

    // Llamamnos apiMadiva
    var southWest = yMin + ' ' + xMin;
    var northWest = yMin + ' ' + xMax;
    var northEast = yMax + ' ' + xMax;
    var southEast = yMax + ' ' + xMin;

    switch (loadType) {
        case 'cargaGeometrias':
            cargaGeometrias(southWest, northWest, northEast, southEast, idProvince);
            break;
        case 'descargaGeometrias':
            borraGeometrias(southWest, northWest, northEast, southEast, idProvince);
            break;
        case 'cargaAntenas':
            cargaAntenas(southWest, northWest, northEast, southEast, idProvince);
            break;
    }
}
