// CONTROLES DE LEAP MOTION //
$.getScript("ThirdParty/leapjs/leap-0.6.4.min.js")
    .done(function(script, textStatus) {
        $.getScript("ThirdParty/leapjs/cesiumLeap.js")
            .done(function(script, textStatus) {

                if (testApp === true)
                    console.log('CARGADADA NAVEGACION ( Leap Motion )');

                var cesiumLeap = new CesiumLeap({
                    scene: viewer,
                    ellipsoid: ellipsoid
                });

                /*var width = document.body.clientWidth,
                    height = document.body.clientHeight,
                    touched = false;

                var gesture,
                    fr;

                Leap.loop({
                    enableGestures: true
                }, function(frame) {

                    $("#cursorLeap").hide();
                    $(".itemMenu").removeClass("menuHover").removeClass("centralHover");

                    fr = frame;
                    if (frame.hands.length > 0) {
                        hand = frame.hands[0];

                        //$('#chivatoLeap').html(frame.interactionBox.size[0] + ' / ' + frame.interactionBox.size[1] + ' / ' + frame.interactionBox.size[2]);

                        if (frame.gestures.length > 0) {
                            gesture = frame.gestures[0].type;
                            if (gesture === 'keyTap') {
                                generaMenu();
                            }
                        }
                    }

                    frame.pointables.forEach(function(pointable, i) {

                        if (i > 0) return;

                        // Activamos cursor del Leap
                        $("#cursorLeap").show();

                        // Calculamos posiciones
                        var pos = [
                            width / 2 + 6 * pointable.tipPosition[0],
                            height - 4 * pointable.tipPosition[1] + 150,
                            pointable.tipPosition[2]
                        ];

                        // Distancia para pulsar boton
                        var sizeDifference = 100 - Math.abs(pos[2]);
                        if (sizeDifference < 0) sizeDifference = 0;

                        // Estilos del cursor
                        $("#cursorLeap").css({
                            top: pos[1] - ($("#cursorLeap").height() / 2),
                            left: pos[0] - ($("#cursorLeap").width() / 2),
                            position: 'absolute'
                        });

                        $("#touchLeap").css({
                            width: sizeDifference + '%'
                        });

                        // Comprobamos colisiones del menu
                        var hitDiv = $("#touchLeap").collision(".itemMenu");

                        if (hitDiv.length != 0) {

                            var menuHover = hitDiv[0].className.split(" ");

                            if (menuHover.length > 1)
                                $("." + menuHover[1]).addClass("menuHover");
                            else
                                $("#menuCentral .itemMenu").addClass("centralHover");

                            if (touched == false && pos[2] < 0) {
                                touched = true;
                                var typeMenu = hitDiv[0].attributes.leaplink.value;
                                generaMenu(typeMenu);
                                lanzaMenu(typeMenu);
                            }

                            if (pos[2] > 0) touched = false;
                        }
                    });
                });*/
            })
            .fail(function(jqxhr, settings, exception) {
                console.log('ERROR CARGANDO ( Plugin Cesium Leap )');
            });
    })
    .fail(function(jqxhr, settings, exception) {
        console.log('ERROR CARGANDO ( Leap Motion JS )');
    });
