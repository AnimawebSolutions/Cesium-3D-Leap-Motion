  // FUNCION PARA COLOCAR PINS EN EL MAPA //
  var pinMaps;

  function creaPin(lat, lng, icon, colorPin) {
      pinMaps = Cesium.when(pinBuilder.fromUrl(Cesium.buildModuleUrl('../../pins/' + icon), Cesium.Color.fromCssColorString(colorPin).withAlpha(1), 48), function(canvas) {
          return viewer.entities.add({
              name: 'Grocery store',
              position: Cesium.Cartesian3.fromDegrees(lng, lat),
              billboard: {
                  image: canvas.toDataURL(),
                  verticalOrigin: Cesium.VerticalOrigin.BOTTOM
              }
          });
      });
  }

  //creaPin(40.462539, -3.691795, 'grocery.png', '#C9423F');
