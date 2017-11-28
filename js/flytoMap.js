// FUNCION PARA IR A CIUDAD

var gotoFly = true;

function flyTo(destination) {
    gotoFly = true;
    switch (destination) {
        case 'MAD':
            var zoomCamera = 800;
            var latFly = 40.400022;
            var lngFly = -3.6984548;
            break;
        case 'BCN':
            var zoomCamera = 800;
            var latFly = 41.373778;
            var lngFly = 2.151050;
            break;
        case 'KIO_MAD':
            var zoomCamera = 800;
            var latFly = 40.462539;
            var lngFly = -3.691795;
            break;
    }
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lngFly, latFly, zoomCamera),
        duration: 10.0,
        complete: function() {
            setTimeout(function() {
                camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(lngFly, latFly, zoomCamera),
                    orientation: {
                        heading: Cesium.Math.toRadians(20.0),
                        pitch: Cesium.Math.toRadians(-7.0)
                    },
                    duration: 3.0,
                    complete: function() {
                        setTimeout(function() {
                            gotoFly = false;
                            getRectangle('cargaGeometrias');
                        }, 3000);
                    }
                });
            }, 1000);
        }
    });
}
