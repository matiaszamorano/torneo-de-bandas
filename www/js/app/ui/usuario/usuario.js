/* global torneoDeBandas */

torneoDeBandas.ui.usuario = (function () {
    var usuario;

    function init() {
        var ingresar = $('.js-datos-sesion .js-ingresar');
        var datosUsuario = $('.js-datos-sesion .js-datos-usuario');
        var nombreUsuario = $('.js-datos-sesion .js-datos-usuario .nombre');
        var puntajeUsuario = $('.js-datos-sesion .js-datos-usuario .puntaje');

        if (torneoDeBandas.service.usuario.estaLogueado()) {

            usuario = torneoDeBandas.service.usuario.get().apodo;
            nombreUsuario.append(torneoDeBandas.service.usuario.get().apodo);

            torneoDeBandas.service.usuario.getPuntaje().done(function (data) {
                puntajeUsuario.append(data);
                ingresar.addClass("hidden");
                datosUsuario.removeClass("hidden");
            });

        } else {
            ingresar.removeClass("hidden");
            datosUsuario.addClass("hidden");
        }
    }


    return {
        init: init
    };
})();

$(document).ready(function () {
    torneoDeBandas.ui.usuario.init();
})
