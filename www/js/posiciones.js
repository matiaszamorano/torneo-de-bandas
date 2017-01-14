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
        var html = templateBandas.render(data);
        $("#bandas").html(html);
        console.log(data);
    }

    return {
        init: init
    };
})();
