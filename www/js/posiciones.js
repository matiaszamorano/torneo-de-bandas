var posiciones = (function () {

    var url = "http://www.comunidadfusa.com/servicios/juegos/torneo-de-bandas/posiciones";

    function init() {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: url,
            cache: false,
            success: mostrarPosiciones
        });
    }

    function mostrarPosiciones(data) {
        var templateBandas = $.templates("#templateBandas");
        var htmlBandas = templateBandas.render(data);
        $("#bandas").html(htmlBandas);

        var templateCanciones = $.templates("#templateCanciones");
        var htmlCanciones = templateCanciones.render(data);
        $("#canciones").html(htmlCanciones);
        
        var templateJugadores = $.templates("#templateJugadores");
        var htmlJugadores = templateJugadores.render(data);
        $("#jugadores").html(htmlJugadores);
    }

    return {
        init: init
    };
})();
