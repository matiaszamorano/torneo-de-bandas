torneoDeBandas.ui.usuario = (function () {
    var usuario;

    function init() {
        var ingresar = $('.datos-sesion .ingresar');
        var datosUsuario = $('.datos-sesion .datos-usuario');
        var nombreUsuario = $('.datos-sesion .datos-usuario .nombre');
        var puntajeUsuario = $('.datos-sesion .datos-usuario .puntaje');

        if (torneoDeBandas.service.usuario.estaLogueado()) {

            ingresar.addClass("hidden");
            usuario = torneoDeBandas.service.usuario.get().apodo;
            nombreUsuario.append(torneoDeBandas.service.usuario.get().apodo);

            torneoDeBandas.service.usuario.getPuntaje().done(function (data) {
                puntajeUsuario.append(data);
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
