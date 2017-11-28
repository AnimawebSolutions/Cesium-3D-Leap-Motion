// LISTENER DE EVENTOS DEL MAPA //

viewer.camera.moveEnd.addEventListener(function() {
    var distanciaKM = Number((cartographic.height * 0.001).toFixed(1));
    ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
    if ((distanciaKM <= 2) && (gotoFly == false)) {
        getRectangle('cargaGeometrias');
    }
});

viewer.clock.onTick.addEventListener(function(clock) {
    var distanciaKM = Number((cartographic.height * 0.001).toFixed(1));
    ellipsoid.cartesianToCartographic(camera.positionWC, cartographic);
    if (distanciaKM <= 2)
        capaMundo.alpha = 0;
    if (distanciaKM > 2.1)
        capaMundo.alpha = 0.2;
    if (distanciaKM > 2.5)
        capaMundo.alpha = 0.4;
    if (distanciaKM > 3.0)
        capaMundo.alpha = 0.6;
    if (distanciaKM > 3.5)
        capaMundo.alpha = 0.8;
    if (distanciaKM > 4)
        capaMundo.alpha = 1;
});
