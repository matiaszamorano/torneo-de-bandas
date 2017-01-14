var resultado = (function () {

    var urlSitio = "http://www.comunidadfusa.com";
    function init() {
        var resultado = window.localStorage.getItem("resultado");
        var audios = JSON.parse(resultado);
        console.log(audios);
        if (audios.length == 1) {
            mostrarGanador(audios);
        } else {
            mostrarEmpate(audios);
        }
    }

    function mostrarGanador(audios) {
        var ganador = audios[0];
        $("#resultadoPlayer01 a img").attr("src", urlSitio + ganador.avatar);
        $("#nombreGanador .nombreBandaGanadora a").text(ganador.nombreBanda);
        $("#nombreGanador .nombreBandaGanadora a").attr("href", urlSitio + "/bandas/" + ganador.url_fusa);
        $("#nombreGanador .nombreTema").text(ganador.nombreTema);
    }

    function mostrarEmpate(audios) {

    }

    return {
        init: init
    };
})();
