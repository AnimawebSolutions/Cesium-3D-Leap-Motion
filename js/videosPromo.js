// FUNCION PARA VER VIDEOS EN EL MAPA //
function pintaVideo(videoID, zonaVideo, videoURL) {

    var idVideo = 'video_' + videoID;
    var videoHtml = '<video id="' + idVideo + '" style="display: none;" autoplay="" loop="" crossorigin="" controls=""></div>';

    $('body').append(videoHtml);
    $('#' + idVideo).append('<source src="video/' + videoURL + '.webm" type="video/webm">');
    $('#' + idVideo).append('<source src="video/' + videoURL + '.mp4" type="video/mp4">');
    $('#' + idVideo).append('<source src="video/' + videoURL + '.mov" type="video/quicktime">');

    var videoElement = document.getElementById(idVideo);

    var pantallaAnuncio = viewer.entities.add({
        name: 'pantallaAnuncio',
        position: Cesium.Cartesian3.fromDegrees(-3.688179, 40.453602, 59.8),
        box: {
            dimensions: new Cesium.Cartesian3(10.8, 0, 6.0),
            material: videoElement,
            rotation: Cesium.Math.toRadians(180),
        }
    });
}

//pintaVideo(1, 'bernabeu', 'video_promo');
