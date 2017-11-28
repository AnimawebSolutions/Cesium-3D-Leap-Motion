// EVENTOS DEL MENU //

function lanzaMenu(typeMenu) {

    if (testApp === true)
        console.log('ACCIÓN del LEAP MOTION ( Pulsa botón ' + typeMenu + ' )');

    switch (typeMenu) {
        case 'madrid':
            $('#contenedorNavegacion').fadeOut('slow', function() {
                flyTo('MAD');
            });
            break;
        case 'barcelona':
            $('#contenedorNavegacion').fadeOut('slow', function() {
                flyTo('BCN');
            });
            break;
        case 'kio':
            $('#contenedorNavegacion').fadeOut('slow', function() {
                flyTo('KIO_MAD');
            });
            break;
        case 'exit':
            $('#contedorMenu').fadeOut();
            $('#contenedorNavegacion').fadeOut();
            break;
    }
}


// FUNCION PARA GENERAR EL MENU DE LA APP //
function generaMenu(typeMenu) {

    // Configuración del menú
    $('#contenedorNavegacion').show();

    $('#contedorMenu').fadeOut('slow', function() {

        $('#contedorMenu').empty();

        switch (typeMenu) {
            case 'ciudades':
                var template = 'submenu';
                var idMenu = 'menuSecundario';
                var menu1 = ['madrid', 'madrid.png'];
                var menu2 = ['barcelona', 'barcelona.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/back.png');
                break;
            case 'antenas':
                var template = 'submenu';
                var idMenu = 'menuSecundario';
                var menu1 = ['antenasMad', 'madrid.png'];
                var menu2 = ['antenasBcn', 'barcelona.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/back.png');
                break;
            case 'antenasMad':
                var template = 'menu';
                var idMenu = 'menuPrincipal';
                var menu1 = ['kio', 'kio.png'];
                var menu2 = ['bernabeu', 'bernabeu.png'];
                var menu3 = ['faro', 'faro.png'];
                var menu4 = ['palacio', 'palacio.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/back.png');
                break;
            case 'antenasBcn':
                var template = 'menu';
                var idMenu = 'menuPrincipal';
                var menu1 = ['calatrava', 'calatrava.png'];
                var menu2 = ['fira', 'fira.png'];
                var menu3 = ['hotel', 'hotel.png'];
                var menu4 = ['agbar', 'agbar.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/back.png');
                break;
            case 'settings':
                var template = 'submenu';
                var idMenu = 'menuSecundario';
                var menu1 = ['full', 'full.png'];
                var menu2 = ['vr', 'vr.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/back.png');
                break;
            default:
                var template = 'menu';
                var idMenu = 'menuPrincipal';
                var menu1 = ['ciudades', 'ciudades.png'];
                var menu2 = ['antenas', 'antenas.png'];
                var menu3 = ['world', 'world.png'];
                var menu4 = ['settings', 'settings.png'];
                $('#menuCentral .itemMenu img').attr('src', 'css/menu/exit.png');
        }

        $('#contedorMenu').append('<div id="' + idMenu + '">');

        if (template === 'submenu') {
            $('#' + idMenu).append('<div class="rowMenu">');
            $('.rowMenu').append('<div class="itemMenu topLeftMenu" leapLink="' + menu1[0] + '"><img src="css/menu/' + menu1[1] + '" /></div>');
            $('#' + idMenu).append('<div class="rowMenu">');
            $('.rowMenu:last-child').append('<div class="itemMenu bottomLeftMenu" leapLink="' + menu2[0] + '"><img src="css/menu/' + menu2[1] + '" /></div>');
        } else {
            $('#' + idMenu).append('<div class="rowMenu">');
            $('.rowMenu').append('<div class="itemMenu topLeftMenu" leapLink="' + menu1[0] + '"><img src="css/menu/' + menu1[1] + '" /></div>');
            $('.rowMenu').append('<div class="itemMenu topRightMenu" leapLink="' + menu2[0] + '"><img src="css/menu/' + menu2[1] + '" /></div>');
            $('#' + idMenu).append('<div class="rowMenu">');
            $('.rowMenu:last-child').append('<div class="itemMenu bottomLeftMenu" leapLink="' + menu3[0] + '"><img src="css/menu/' + menu3[1] + '" /></div>');
            $('.rowMenu:last-child').append('<div class="itemMenu bottomRightMenu" leapLink="' + menu4[0] + '"><img src="css/menu/' + menu4[1] + '" /></div>');
        }

        $('#contedorMenu').fadeIn('slow');

        // Click de los botones
        $(".itemMenu").bind('click', function(event) {
            var typeMenu = event.currentTarget.attributes.leaplink.value;
            generaMenu(typeMenu);
            lanzaMenu(typeMenu);
        })
    });
}
